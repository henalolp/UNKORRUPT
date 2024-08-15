import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Types "types";
import Map "mo:map/Map";
import { phash } "mo:map/Map";
import Vector "mo:vector";
import Random "mo:base/Random";
import Blob "mo:base/Blob";

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

  stable let members = Map.new<Principal, User>();
  stable let courses = Vector.new<Course>();

  stable var nextUserId = 0;
  stable var nextCourseId = 0;
  stable var owner = caller;

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

  private func courseEqual(course1 : EnrolledCourse, course2 : EnrolledCourse) : Bool {
    course1.id == course2.id;
  };

  public shared ({ caller }) func changeOwner(newOwner : Principal) {
    assert owner == caller;
    owner := newOwner;
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
  public shared func registerUser(username : Text, country : Text, state : Text) : async Result<Text, Text> {
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
            let enrolledCourse = {
              id = c.id;
              completed = false;
            };
            if (Vector.contains(member.enrolledCourses, enrolledCourse, courseEqual)) {
              return #err("Course already enrolled");
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

  // Create new resource for course
  public shared ({ caller }) func createResource(courseId : Nat, title : Text, description : Text, url : Text, rType : ResourceType) : async Result<Text, Text> {
    assert caller == owner;
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
    assert caller == owner;
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
    assert caller == owner;
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
            let enrolledCourse = {
              id = c.id;
              completed = true;
            };
            if (Vector.contains(member.enrolledCourses, enrolledCourse, courseEqual) == false) {
              return #err("Course not enrolled");
            };

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

            Vector.put(member.enrolledCourses, enrolledCourseIndex, enrolledCourse);

            // Update user object
            Map.set(members, phash, caller, member);

            return #ok("You have successfully completed the course");
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
  public query func generateCourse(title : Text, description : Text) : async ?Text {
    let prompt = "
      Create a detailed course outline in JSON format for a course titled " Understanding Corruption ". The course should cover the definition, types, and impacts of corruption. Include a description, recommended resources (books, articles, videos, slides, reports), and multiple-choice questions with detailed explanations for each answer.

      Note: This data should be taken from live and verified sources online. Every Url generated should point to active working URL.

      IMPORTANT: Return only the json format, no extra text, just the json file, don't explain

      Generate 20 questions

      JSON Structure:

      title: " # title # "
      description: " # description # "
      resources: An array of objects, each containing title, description, URL, and resource type (Book, Article, Video, Slides, Report)
      questions: An array of objects, each containing the question, an array of options with descriptions and explanations, and the correct answer index.

      {
          'title': '',
          'description': '',
          'resources': [
            {
              'title': '',
              'description': '',
              'url': '',
              'rType': 'Book | Article | Video | Slides | Report'
            }
          ],
          'questions': [
            {
              'q': '',
              'options': [
                {
                  'o': 1,
                  'description': '',
                  'reason': 'Why correct or wrong'
                },
                {
                  'o': 2,
                  'description': '',
                  'reason': 'Why correct or wrong'
                },
                {
                  'o': 3,
                  'description': '',
                  'reason': 'Why correct or wrong'
                },
                {
                  'o': 4,
                  'description': '',
                  'reason': 'Why correct or wrong'
                }
              ],
              'correct': 1
            }
          ]
        }
    ";
  };
};
