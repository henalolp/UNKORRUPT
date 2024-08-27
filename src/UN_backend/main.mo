import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Types "types";
import Request "request";
import Map "mo:map/Map";
import { phash } "mo:map/Map";
import Vector "mo:vector";
import Random "mo:base/Random";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import JSON "mo:json.mo";
import ICRC1 "mo:icrc1-types";
import Utils "utils";
import serdeJson "mo:serde/JSON";
import { recurringTimer } = "mo:base/Timer";

shared ({ caller }) actor class Backend() {
  type Result<A, B> = Types.Result<A, B>;
  type SharedCourseWithResources = Types.SharedCourseWithResources;
  type SharedCourse = Types.SharedCourse;
  type User = Types.User;
  type SharedUser = Types.SharedUser;
  type Course = Types.Course;
  type Question = Types.Question;
  type ResourceType = Types.ResourceType;
  type CourseStatus = Types.CourseStatus;
  type QuestionOption = Types.QuestionOption;
  type Resource = Types.Resource;
  type EnrolledCourse = Types.EnrolledCourse;
  type SubmittedAnswer = Types.SubmittedAnswer;
  type Report = Types.Report;
  type RunStatus = Types.RunStatus;
  type ThreadRun = Types.ThreadRun;
  type SendMessageStatus = Types.SendMessageStatus;
  type Message = Types.Message;

  stable let members = Map.new<Principal, User>();
  stable let courses = Vector.new<Course>();
  stable let reports = Vector.new<Report>();
  stable let reportUpvotes = Vector.new<Vector.Vector<Principal>>();
  stable var threadRunQueue = Vector.new<ThreadRun>();

  stable var nextUserId = 0;
  stable var nextCourseId = 0;
  stable var nextReportId = 0;
  stable var owner = caller;

  var icrc1Actor_ : ICRC1.Service = actor ("mxzaz-hqaaa-aaaar-qaada-cai");
  var icrc1TokenCanisterId_ : Text = Types.INVALID_CANISTER_ID;

  private var API_KEY : Text = "";
  private var ASSISTANT_ID : Text = "";

  private func _getInProgressThreadRuns(threadId : Text) : [ThreadRun] {
    let runs = Vector.new<ThreadRun>();
    for (run in Vector.vals(threadRunQueue)) {
      if (run.threadId == threadId) {
        Vector.add(runs, run);
      };
    };
    Vector.toArray(runs);
  };

  private func _getCourse(courseId : Nat) : ?Course {
    Vector.getOpt(courses, courseId);
  };

  private func _getRandomNumber(range : Nat, seed : Blob) : Nat {
    assert range > 0;
    let max : Float = 4294967295;
    let num = Float.floor((Float.fromInt(Random.rangeFrom(32, seed)) / max) * Float.fromInt(range));
    switch (Nat.fromText(Float.toText(num))) {
      case (?n) {
        return n;
      };
      case (null) {
        return 0;
      };
    };
  };

  private func _isOwner(p : Principal) : Bool {
    return true;
    // owner == p;
  };

  // get token canister id
  public query func get_icrc1_token_canister_id() : async Text {
    icrc1TokenCanisterId_;
  };

  // set icrc1 token canister
  public shared ({ caller }) func set_icrc1_token_canister(tokenCanisterId : Text) : async Result<(), Text> {
    if (_isOwner(caller) == false) return #err("Not authorized");

    let icrc1Canister = try {
      #ok(await Utils.createIcrcActor(tokenCanisterId));
    } catch e #err(e);

    switch (icrc1Canister) {
      case (#ok(icrc1Actor)) {
        icrc1Actor_ := icrc1Actor;
        icrc1TokenCanisterId_ := tokenCanisterId;
        #ok;
      };
      case (#err(e)) {
        #err("Failed to instantiate icrc1 token canister from given id(" # tokenCanisterId # ") for reason " # Error.message(e));
      };
    };
  };

  private func courseEqual(course1 : EnrolledCourse, course2 : EnrolledCourse) : Bool {
    course1.id == course2.id;
  };

  public shared ({ caller }) func changeOwner(newOwner : Principal) {
    assert _isOwner(caller);
    owner := newOwner;
  };

  // Set api key
  public shared ({ caller }) func changeApiKey(apiKey : Text) {
    assert _isOwner(caller);
    API_KEY := apiKey;
  };

  // Set assistant id
  public shared ({ caller }) func setAssistantId(id : Text) {
    assert _isOwner(caller);
    ASSISTANT_ID := id;
  };

  // List all courses
  public query func listCourses(status : CourseStatus) : async [SharedCourse] {
    let filteredCourses = Vector.new<Types.SharedCourse>();
    for (course in Vector.vals(courses)) {
      if (course.status == status) {
        let sharedCourse = {
          id = course.id;
          title = course.title;
          summary = course.summary;
          enrolledCount = course.enrolledCount;
          reportCount = course.reportCount;
          status = course.status;
        };
        Vector.add(filteredCourses, sharedCourse);
      };
    };
    return Vector.toArray(filteredCourses);
  };

  // Get user enrolled courses
  public shared ({ caller }) func getUserEnrolledCourses() : async Result<[SharedCourse], Text> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?member) {
        let enrolledCourses = Vector.new<SharedCourse>();
        for (enrolledCourse in Vector.vals(member.enrolledCourses)) {
          let course = _getCourse(enrolledCourse.id);
          switch (course) {
            case (?c) {
              let sharedCourse = {
                id = c.id;
                title = c.title;
                summary = c.summary;
                enrolledCount = c.enrolledCount;
                reportCount = c.reportCount;
                status = c.status;
              };
              Vector.add(enrolledCourses, sharedCourse);
            };
            case (null) {
              return #err("Course " # Nat.toText(enrolledCourse.id) # " not found");
            };
          };
        };
        return #ok(Vector.toArray(enrolledCourses));
      };
      case (null) {
        return #err("Member not found");
      };
    };
  };

  // Get course details including resources
  public query func getCourseDetails(courseId : Nat) : async Result<SharedCourseWithResources, Text> {
    let course = _getCourse(courseId);
    switch (course) {
      case (?c) {
        let sharedCourse = {
          id = c.id;
          title = c.title;
          summary = c.summary;
          enrolledCount = c.enrolledCount;
          reportCount = c.reportCount;
          status = c.status;
          resources = Vector.toArray(c.resources);
        };
        return #ok(sharedCourse);
      };
      case (null) {
        return #err("Course " # Nat.toText(courseId) # " not found");
      };
    };
  };

  // Get random course questions
  public shared func getRandomCourseQuestions(courseId : Nat, questionCount : Nat) : async Result<[Question], Text> {
    let course = _getCourse(courseId);
    switch (course) {
      case (?c) {
        let questions = Vector.new<Question>();
        let len = Vector.size(c.questions);

        if (len == 0) {
          return #err("Course has no questions");
        };
        if (questionCount > len) {
          return #err("Question count " # Nat.toText(questionCount) # " is greater than the number of questions " # Nat.toText(len));
        };

        for (number in Iter.range(1, questionCount)) {
          let seed = await Random.blob();
          let questionId = _getRandomNumber(len, seed);
          let question = Vector.get(c.questions, questionId);
          Vector.add(questions, question);
        };

        return #ok(Vector.toArray(questions));
      };
      case (null) {
        return #err("Course " # Nat.toText(courseId) # " not found");
      };
    };
  };

  // Register a new user
  public shared ({ caller }) func registerUser(username : Text, country : Text, state : Text) : async Result<Text, Text> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?_) {
        return #err("User already registered");
      };
      case (null) {
        let newUser = {
          id = nextUserId;
          username = username;
          country = country;
          state = state;
          enrolledCourses = Vector.new<EnrolledCourse>();
        };
        Map.set(members, phash, caller, newUser);
        nextUserId := nextUserId + 1;
        return #ok("User registered successfully");
      };
    };
  };

  // Get user profile
  public shared ({ caller }) func getProfile() : async Result<SharedUser, Text> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?member) {
        let sharedUser = {
          id = member.id;
          username = member.username;
          country = member.country;
          state = member.state;
        };
        return #ok(sharedUser);
      };
      case (null) {
        return #err("Member not found");
      };
    };
  };

  // Enroll in a course
  public shared ({ caller }) func enrollCourse(courseId : Nat) : async Result<Text, Text> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?member) {
        let course = _getCourse(courseId);
        switch (course) {
          case (?c) {
            for (_course in Vector.vals(member.enrolledCourses)) {
              if (_course.id == c.id) {
                return #err("Course already enrolled");
              };
            };

            // Create thread
            let headers : ?[Types.HttpHeader] = ?[
              {
                name = "Authorization";
                value = "Bearer " # API_KEY;
              },
              {
                name = "OpenAI-Beta";
                value = "assistants=v2";
              },
            ];

            let response = await Request.post(
              "https://api.openai.com/v1/threads/",
              null,
              transform,
              headers,
            );

            if (response.status != 200) {
              return #err("Failed to create thread");
            };

            var threadId = "";

            switch (response.body) {
              case (#Object(v)) {
                label findId for ((k, v) in v.vals()) {
                  if (k == "id") {
                    switch (v) {
                      case (#String(v)) {
                        threadId := v;
                        break findId;
                      };
                      case (_) {
                        return #err("Json parse failed");
                      };
                    };
                  };
                };
              };
              case (_) {
                return #err("Json parse failed");
              };
            };

            if (threadId == "") {
              return #err("Create thread failed");
            };

            let messages = Vector.new<Message>();
            let enrolledCourse = {
              id = c.id;
              completed = false;
              threadId = threadId;
              messages = messages;
            };
            Vector.add(member.enrolledCourses, enrolledCourse);

            // Update course enrolled count
            let updatedCourse = {
              id = c.id;
              title = c.title;
              summary = c.summary;
              enrolledCount = c.enrolledCount + 1;
              reportCount = c.reportCount;
              status = c.status;
              resources = c.resources;
              questions = c.questions;
              nextResourceId = c.nextResourceId;
              nextQuestionId = c.nextQuestionId;
            };
            Vector.put(courses, c.id, updatedCourse);

            return #ok("Course enrolled successfully");
          };
          case (null) {
            return #err("Course " # Nat.toText(courseId) # " not found");
          };
        };
      };
      case (null) {
        return #err("Member not found");
      };
    };
  };

  // Create a course
  public shared ({ caller }) func createCourse(title : Text, summary : Text) : async Result<Nat, Text> {
    assert _isOwner(caller);

    let resources = Vector.new<Resource>();
    let questions = Vector.new<Question>();
    let course = {
      id = nextCourseId;
      title = title;
      summary = summary;
      enrolledCount = 0;
      reportCount = 0;
      status = #Approved;
      resources = resources;
      questions = questions;
      nextQuestionId = 0;
      nextResourceId = 0;
    };

    Vector.add(courses, course);
    nextCourseId := nextCourseId + 1;
    #ok(nextCourseId - 1);
  };

  // Create new resource for course
  public shared ({ caller }) func createResource(courseId : Nat, title : Text, description : Text, url : Text, rType : ResourceType) : async Result<Text, Text> {
    assert _isOwner(caller);
    let course = _getCourse(courseId);
    switch (course) {
      case (?c) {
        let resource = {
          id = c.nextResourceId;
          title = title;
          description = description;
          url = url;
          rType = rType;
        };
        Vector.add(c.resources, resource);
        let updatedCourse = {
          id = c.id;
          title = c.title;
          summary = c.summary;
          enrolledCount = c.enrolledCount;
          reportCount = c.reportCount;
          status = c.status;
          resources = c.resources;
          questions = c.questions;
          nextResourceId = c.nextResourceId + 1;
          nextQuestionId = c.nextQuestionId;
        };
        Vector.put(courses, c.id, updatedCourse);
      };
      case (null) {
        return #err("Course " # Nat.toText(courseId) # " not found");
      };
    };
    return #ok("Resource created successfully");
  };

  // Update course details
  public shared ({ caller }) func updateCourse(courseId : Nat, title : Text, summary : Text, status : CourseStatus) : async Result<Text, Text> {
    assert _isOwner(caller);
    let course = _getCourse(courseId);
    switch (course) {
      case (?c) {
        let updatedCourse = {
          id = c.id;
          title = title;
          summary = summary;
          status = status;
          enrolledCount = c.enrolledCount;
          reportCount = c.reportCount;
          resources = c.resources;
          questions = c.questions;
          nextResourceId = c.nextResourceId;
          nextQuestionId = c.nextQuestionId;
        };
        Vector.put(courses, c.id, updatedCourse);
        return #ok("Course updated successfully");
      };
      case (null) {
        return #err("Course " # Nat.toText(courseId) # " not found");
      };
    };
  };

  // Add a question to a course
  public shared ({ caller }) func addQuestion(courseId : Nat, data : Question) : async Result<Text, Text> {
    assert _isOwner(caller);
    let course = _getCourse(courseId);
    switch (course) {
      case (?c) {
        let question = {
          id = c.nextQuestionId;
          options = data.options;
          correctOption = data.correctOption;
          hint = data.hint;
          description = data.description;
        };
        Vector.add(c.questions, question);
        let updatedCourse = {
          id = c.id;
          title = c.title;
          summary = c.summary;
          enrolledCount = c.enrolledCount;
          reportCount = c.reportCount;
          status = c.status;
          resources = c.resources;
          questions = c.questions;
          nextResourceId = c.nextResourceId;
          nextQuestionId = c.nextQuestionId + 1;
        };
        Vector.put(courses, c.id, updatedCourse);
        return #ok("Question added successfully");
      };
      case (null) {
        return #err("Course " # Nat.toText(courseId) # " not found");
      };
    };
  };

  // Submit questions attempt
  public shared ({ caller }) func submitQuestionsAttempt(courseId : Nat, answers : [SubmittedAnswer]) : async Result<Text, Text> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?member) {
        let course = _getCourse(courseId);
        switch (course) {
          case (?c) {

            var enrolledCourse : ?EnrolledCourse = null;

            label findCourse for (_course in Vector.vals(member.enrolledCourses)) {
              if (_course.id == c.id) {
                enrolledCourse := ?_course;
                break findCourse;
              };
            };

            switch (enrolledCourse) {
              case (null) {
                return #err("Course not enrolled");
              };
              case (?enrolledCourse) {

                let len = Vector.size(c.questions);
                if (len == 0) {
                  return #err("Course has no questions");
                };
                if (Array.size(answers) > len) {
                  return #err("Number of answers is greater than the number of questions");
                };

                var correctCount = 0;
                for (i in Iter.range(0, len)) {
                  let answer = answers[i];
                  let question = Vector.get(c.questions, answer.questionId);
                  if (question.correctOption == answer.option) {
                    correctCount += 1;
                  };
                };

                if (correctCount != len) {
                  return #err("You did not get all the questions, Try again");
                };

                var enrolledCourseIndex = 0;
                for (i in Iter.range(0, Vector.size(member.enrolledCourses))) {
                  if (Vector.get(member.enrolledCourses, i).id == c.id) {
                    enrolledCourseIndex := i;
                  };
                };

                let previousValue = Vector.get(member.enrolledCourses, enrolledCourseIndex);
                if (previousValue.completed) {
                  return #err("You have already completed this course before");
                };

                // Transfer tokens to user
                // Make the icrc1 intercanister transfer call, catching if error'd:
                let response : Result<ICRC1.TransferResult, Text> = try {
                  #ok(await icrc1Actor_.icrc1_transfer({ amount = 5; created_at_time = null; from_subaccount = null; fee = null; memo = null; to = { owner = caller; subaccount = null } }));
                } catch (e) {
                  #err(Error.message(e));
                };

                // Parse the results of the icrc1 intercansiter transfer call:
                switch (response) {
                  case (#ok(transferResult)) {
                    switch (transferResult) {
                      case (#Ok _) {
                        // Updated enrolled course to completed
                        Vector.put(member.enrolledCourses, enrolledCourseIndex, enrolledCourse);
                        // Update user object
                        Map.set(members, phash, caller, member);
                        return #ok("You have successfully completed the course");
                      };
                      case (#Err _) #err(
                        "The icrc1 transfer call could not be completed as requested."
                      );
                    };
                  };
                  case (#err(_)) {
                    #err(
                      "The intercanister icrc1 transfer call caught an error and did not finish processing."
                    );
                  };
                };
              };
            };
          };
          case (null) {
            return #err("Course " # Nat.toText(courseId) # " not found");
          };
        };
      };
      case (null) {
        return #err("Member not found");
      };
    };
  };

  // Make call to AI model
  public shared ({ caller }) func sendThreadMessage(threadId : Text, prompt : Text) : async Result<SendMessageStatus, SendMessageStatus> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?member) {
        var enrolledCourse : ?EnrolledCourse = null;
        var enrolledCourseIdx = 0;

        for (_course in Vector.vals(member.enrolledCourses)) {
          if (_course.threadId == threadId) {
            enrolledCourse := ?_course;
          };
          enrolledCourseIdx := enrolledCourseIdx + 1;
        };

        switch (enrolledCourse) {
          case (null) {
            return #err(#Failed("Enrolled course with thread id not found"));
          };
          case (?eCourse) {
            // Check if there is no pending run
            let inProgressRuns = _getInProgressThreadRuns(threadId);
            if (Array.size(inProgressRuns) > 0) {
              return #err(#ThreadLock({ runId = inProgressRuns[0].runId }));
            };

            var data = #Object([
              ("role", #String("user")),
              ("content", #String(prompt)),
            ]);

            let headers : ?[Types.HttpHeader] = ?[
              {
                name = "Authorization";
                value = "Bearer " # API_KEY;
              },
              {
                name = "OpenAI-Beta";
                value = "assistants=v2";
              },
            ];

            let response = await Request.post(
              "https://api.openai.com/v1/threads/" # threadId # "/messages",
              data,
              transform,
              headers,
            );

            if (response.status != 200) {
              return #err(#Failed("Failed to create message"));
            };

            let newMessage = {
              content = prompt;
              role = #User;
            };

            Vector.add(eCourse.messages, newMessage);
            Vector.put(member.enrolledCourses, enrolledCourseIdx, eCourse);
            Map.set(members, phash, caller, member);

            // Create new run
            data := #Object([
              ("assistant_id", #String(ASSISTANT_ID)),
              ("instructions", #String("You are a helpful assistant, here to train users on the impacts of corruption and how to mitigate them based on the files you have been trained with and all your responses must be in markdown format")),
            ]);
            let runResponse = await Request.post(
              "https://api.openai.com/v1/threads/" # threadId # "/runs",
              data,
              transform,
              headers,
            );

            Debug.print(JSON.show(runResponse.body));

            var runId = "";

            switch (runResponse.body) {
              case (#Object(v)) {
                label findId for ((k, v) in v.vals()) {
                  if (k == "id") {
                    switch (v) {
                      case (#String(v)) {
                        runId := v;
                        break findId;
                      };
                      case (_) {
                        return #err(#Failed("Json parse failed"));
                      };
                    };
                  };
                };
              };
              case (_) {
                return #err(#Failed("Json parse failed"));
              };
            };

            if (runId == "") {
              return #err(#Failed("Run failed"));
            };

            let threadRun = {
              runId = runId;
              threadId = threadId;
              status = #InProgress;
              timestamp = Time.now();
              lastExecuted = null;
            };

            Vector.add(threadRunQueue, threadRun);

            return #ok(#Completed({ runId = runId }));
          };
        };
      };
      case (null) {
        return #err(#Failed("Member not found"));
      };
    };

  };

  // Make call to AI model
  public shared func generateCourse(title : Text, description : Text) : async Text {
    let prompt = "Create a detailed course description in JSON format for a course titled "
    # title
    # ". Include a description and recommended resources (books, articles, videos, slides, reports),"
    # "Note: This data should be taken from live and verified sources online. Every Url generated should point to active working URL."
    # "IMPORTANT: Return only the valid json format, no extra text, just the json file, don't explain"
    # "JSON Structure:"
    # "title: " # title
    # "description: " # description
    # "resources: An array of objects, each containing title, description, URL, and resource type (Book, Article, Video, Slides, Report)."
    # " Don't add the ```json``` text"
    # "{"
    # "'title': '',"
    # "'description': '',"
    # "'resources': ["
    # "{"
    # "'title': '',"
    # "'description': '',"
    # "'url': '',"
    # "'rType': 'Book | Article | Video | Slides | Report'"
    # "}"
    # "]"
    # "}";
    let model = "gpt-4o-mini";
    let data : JSON.JSON = #Object([
      ("model", #String(model)),
      ("messages", #Array([#Object([("role", #String("system")), ("content", #String("You are a helpful assistant."))]), #Object([("role", #String("user")), ("content", #String(prompt))])])),
    ]);

    let headers : ?[Types.HttpHeader] = ?[{
      name = "Authorization";
      value = "Bearer " # API_KEY;
    }];

    let response = await Request.post(
      "https://api.openai.com/v1/chat/completions",
      ?data,
      transform,
      headers,
    );

    switch (response.body) {
      case (#Array val) {
        Debug.print("Got here 1");
        let item = val[0];
        Debug.print(debug_show (item));
        switch (item) {
          case (#Object kvs) {
            Debug.print("Got here 2");
            let message = kvs[1].1;
            Debug.print(debug_show (message));
            switch (message) {
              case (#Object items) {
                let content = items[1].1;
                return JSON.show(content);
              };
              case (_) {
                return "";
              };
            };
          };
          case (_) {
            return "";
          };
        };
      };
      case (_) {
        return "";
      };
    };
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

  // Create a new report
  public shared ({ caller }) func createReport(country : Text, state : Text, details : Text, category : Text, image : Blob) : async Result<(), Text> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?_) {
        let report : Report = {
          id = nextReportId;
          country = country;
          state = state;
          details = details;
          category = category;
          image = image;
          upvotes = 0;
          owner = caller;
        };
        Vector.add<Report>(reports, report);

        // Create a new upvote array with same id to ensure upvoting is unique
        let upvotes = Vector.new<Principal>();
        Vector.add(reportUpvotes, upvotes);

        nextReportId := nextReportId + 1;
        #ok();
      };
      case (null) {
        return #err("Member not found");
      };
    };
  };

  // List reports by category
  public query func listReports(category : Text) : async [Report] {
    if (category == "") {
      return Vector.toArray(reports);
    };
    let filtered = Vector.new<Report>();
    for (report in Vector.vals(reports)) {
      if (report.category == category) {
        Vector.add(filtered, report);
      };
    };
    Vector.toArray(filtered);
  };

  // Upvote a report
  public shared ({ caller }) func upvoteReport(reportId : Nat) : async Result<Nat, Text> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?_) {
        switch (Vector.getOpt(reports, reportId)) {
          case (?report) {
            let upvotes = Vector.get(reportUpvotes, reportId);
            let hasUpvoted = Vector.forSome<Principal>(upvotes, func x { x == caller });
            if (hasUpvoted) {
              return #ok(report.upvotes);
            };
            Vector.add(upvotes, caller);
            Vector.put(reportUpvotes, reportId, upvotes);
            let updatedReport = {
              id = report.id;
              country = report.country;
              state = report.state;
              details = report.details;
              category = report.category;
              image = report.image;
              upvotes = report.upvotes + 1;
              owner = report.owner;
            };
            Vector.put(reports, reportId, updatedReport);
            #ok(updatedReport.upvotes);
          };
          case (null) {
            #err("Report not found");
          };
        };
      };
      case (null) {
        #err("Member not found");
      };
    };
  };

  // Jobs
  private func pollRuns() : async () {
    let newThreadRunQueue = Vector.new<ThreadRun>();
    var runIdx = 0;
    // Poll for run status
    for (run in Vector.vals(threadRunQueue)) {
      switch (run.status) {
        case (#InProgress) {
          // Poll run id
          let headers : ?[Types.HttpHeader] = ?[
            {
              name = "Authorization";
              value = "Bearer " # API_KEY;
            },
            {
              name = "OpenAI-Beta";
              value = "assistants=v2";
            },
          ];

          let response = await Request.get(
            "https://api.openai.com/v1/threads/" # run.threadId # "/runs/" # run.runId,
            transform,
            headers,
          );

          var status = "";
          var runStatus: RunStatus = #InProgress;

          if (response.status != 200) {
            status := "failed";
          } else {
            switch (response.body) {
              case (#Object(v)) {
                label findId for ((k, v) in v.vals()) {
                  if (k == "status") {
                    switch (v) {
                      case (#String(v)) {
                        status := v;
                        break findId;
                      };
                      case (_) {};
                    };
                  };
                };
              };
              case (_) {};
            };

            switch (status) {
              case ("completed") {
                runStatus := #Completed;
              };
              case ("failed") {
                runStatus := #Failed;
              };
              case ("cancelled") {
                runStatus := #Cancelled;
              };
              case ("expired") {
                runStatus := #Expired;
              };
              case (_) {
                runStatus := #Failed;
              };
            };
          };
        };
        case (_) {
          switch (run.lastExecuted) {
            case (null) {};
            case (?timestamp) {
              let LIFESPAN = 3 * 60000000000; // 3 mins in nano secs
              if (Time.now() - timestamp < LIFESPAN) {
                // Run has not exceeded lifespan and should be kept
                Vector.add(newThreadRunQueue, run);
              };
            };
          };
        };
      };
      runIdx := runIdx + 1;
    };

    threadRunQueue := newThreadRunQueue;
  };

  // Timers
  ignore recurringTimer<system>(#seconds 5, pollRuns);
};
