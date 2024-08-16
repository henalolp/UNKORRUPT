import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Source "mo:uuid/async/SourceV4";
import UUID "mo:uuid/UUID";
import Types "types";
import JSON "mo:json.mo";

module Request {
  type Result<A, B> = Result.Result<A, B>;

  let ic : Types.IC = actor ("aaaaa-aa");

  public func getHost(url : Text) : Text {
    // Remove the protocol
    let urlWithoutProtocol = Text.trimStart(Text.trimStart(url, #text "https://"), #text "http://");
    let parts = Iter.toArray(Text.split(urlWithoutProtocol, #char '/'));
    assert Array.size(parts) != 0;
    return parts[0];
  };

  public func getPort(url : Text) : Text {
    if (Text.startsWith(url, #text "https://")) {
      return ":443";
    };
    return ":80";
  };

  public func get(
    url : Text,
    transform : Types.TransformFn,
  ) : async ?Text {
    // prepare headers for the system http_request call
    let request_headers = [
      { name = "Host"; value = getHost(url) # getPort(url) },
      { name = "User-Agent"; value = "unkorrupt_canister" },
    ];

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    let http_request : Types.HttpRequestArgs = {
      url = url;
      max_response_bytes = null; //optional for request
      headers = request_headers;
      body = null; //optional for request
      method = #get;
      transform = ?transform_context;
    };

    Cycles.add<system>(20_949_972_000);

    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    let response_body : Blob = Blob.fromArray(http_response.body);

    return Text.decodeUtf8(response_body);
  };

  public func post(
    url : Text,
    data : JSON.JSON,
    transform : Types.TransformFn,
    headers : ?[Types.HttpHeader],
  ) : async JSON.JSON {
    // prepare headers for the system http_request call
    let g = Source.Source();
    let idempotency_key = UUID.toText(await g.new());
    var request_headers = [
      { name = "Host"; value = getHost(url) # getPort(url) },
      { name = "User-Agent"; value = "unkorrupt_canister" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    switch (headers) {
      case (?h) {
        let initial = Buffer.fromArray<Types.HttpHeader>(request_headers);
        let new = Buffer.fromArray<Types.HttpHeader>(h);
        initial.append(new);
        request_headers := Buffer.toArray(initial);
      };
      case (null) {};
    };

    let request_body_as_blob : Blob = Text.encodeUtf8(JSON.show(data));
    let request_body_as_nat8 : [Nat8] = Blob.toArray(request_body_as_blob);

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    let http_request : Types.HttpRequestArgs = {
      url = url;
      max_response_bytes = null; //optional for request
      headers = request_headers;
      body = ?request_body_as_nat8;
      method = #post;
      transform = ?transform_context;
    };

    Cycles.add<system>(230_850_258_000);

    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    let response_body : Blob = Blob.fromArray(http_response.body);

    switch (Text.decodeUtf8(response_body)) {
      case (null) { #Object([("error", #String("No response"))]) };
      case (?y) {
        switch (JSON.parse(y)) {
          case (null) {
            #Object([("error", #String("Invalid json string"))]);
          };
          case (?json) { json };
        };
      };
    };
  };
};
