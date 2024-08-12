import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Types "types";

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

  public func get(url : Text) : async ?Text {
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

    Cycles.add(20_949_972_000);

    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    let response_body : Blob = Blob.fromArray(http_response.body);

    return Text.decodeUtf8(response_body);
  };

  public query func transform(raw : Types.TransformArgs) : async Types.CanisterHttpResponsePayload {
    let transformed : Types.CanisterHttpResponsePayload = {
      status = raw.response.status;
      body = raw.response.body;
      headers = [
        {
          name = "Content-Security-Policy";
          value = "default-src 'self'";
        },
        { name = "Referrer-Policy"; value = "strict-origin" },
        { name = "Permissions-Policy"; value = "geolocation=(self)" },
        {
          name = "Strict-Transport-Security";
          value = "max-age=63072000";
        },
        { name = "X-Frame-Options"; value = "DENY" },
        { name = "X-Content-Type-Options"; value = "nosniff" },
      ];
    };
    transformed;
  };
};
