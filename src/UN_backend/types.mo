import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Vector "mo:vector";

module {
  public type Vector<T> = Vector.Vector<T>;
  public type Result<A, B> = Result.Result<A, B>;

  public type User = {
    id : Nat;
    username : Text;
    country : Text;
    state : Text;
    enrolledCourses : Vector<EnrolledCourse>;
  };

  public type EnrolledCourse = {
    id : Nat;
    completed : Bool;
  };

  public type SharedUser = {
    id : Nat;
    username : Text;
    country : Text;
    state : Text;
  };

  public type CourseStatus = {
    #InReview;
    #Approved;
    #Rejected;
    #InFix;
  };

  public type Course = {
    id : Nat;
    title : Text;
    summary : Text;
    enrolledCount : Nat;
    reportCount : Nat;
    status : CourseStatus;
    resources : Vector<Resource>;
    questions : Vector<Question>;
    nextQuestionId : Nat;
    nextResourceId : Nat;
  };

  public type SharedCourse = {
    id : Nat;
    title : Text;
    summary : Text;
    enrolledCount : Nat;
    reportCount : Nat;
    status : CourseStatus;
  };

  public type SharedCourseWithResources = {
    id : Nat;
    title : Text;
    summary : Text;
    enrolledCount : Nat;
    reportCount : Nat;
    status : CourseStatus;
    resources : [Resource];
  };

  public type ResourceType = {
    #Book;
    #Video;
    #Article;
    #Slides;
    #Report;
  };

  public type Resource = {
    id : Nat;
    title : Text;
    description : Text;
    url : Text;
    rType : ResourceType;
  };

  public type Question = {
    id : Nat;
    description : Text;
    options : [QuestionOption];
    correctOption : Nat;
    hint : Text;
  };

  public type QuestionOption = {
    option : Nat;
    description : Text;
    reason : Text;
  };

  public type SubmittedAnswer = {
    questionId : Nat;
    option : Nat;
  };
};
