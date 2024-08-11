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

actor Backend {
  type Result<A, B> = Types.Result<A, B>;
  type SharedCourseWithResources = Types.SharedCourseWithResources;
  type SharedCourse = Types.SharedCourse;
  type User = Types.User;
  type Course = Types.Course;
  type Question = Types.Question;
  type ResourceType = Types.ResourceType;

  stable let members = Map.new<Principal, User>();
  stable let courses = Vector.new<Course>();

  stable var nextUserId = 0;
  stable var nextCourseId = 0;
  stable var nextResourceId = 0;
  stable var nextQuestionId = 0;

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

  public query func listApprovedCourses() : async [SharedCourse] {
    let approvedCourses = Vector.new<Types.SharedCourse>();
    for (course in Vector.vals(courses)) {
      if (course.status == #Approved) {
        let sharedCourse = {
          id = course.id;
          title = course.title;
          summary = course.summary;
          enrolledCount = course.enrolledCount;
          reportCount = course.reportCount;
          status = course.status;
        };
        Vector.add(approvedCourses, sharedCourse);
      };
    };
    return Vector.toArray(approvedCourses);
  };

  public shared ({ caller }) func getUserEnrolledCourses() : async Result<[SharedCourse], Text> {
    let user = Map.get(members, phash, caller);
    switch (user) {
      case (?member) {
        let enrolledCourses = Vector.new<SharedCourse>();
        for (courseId in Vector.vals(member.enrolledCourses)) {
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
              };
              Vector.add(enrolledCourses, sharedCourse);
            };
            case (null) {
              return #err("Course " # Nat.toText(courseId) # " not found");
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
};
