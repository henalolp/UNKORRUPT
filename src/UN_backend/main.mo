import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Array "mo:base/Array";

actor CourseManager {

  // List of predefined courses
  let courses: [Text] = [
    "Introduction to Anti-Corruption Principles",
    "Anti-Corruption in Public Procurement",
    "Ethical Guidelines and Policies",
    "Acting for the Rule of Law",
    "Advanced Anti-Corruption Strategies",
    "Corruption in Public Finance Management",
    "Global Perspectives on Anti-Corruption"
  ];
  
  // Mapping of courses to their resource links
  let courseResources: [(Text, [Text])] = [
    ("Introduction to Anti-Corruption Principles", ["https://www.unodc.org/documents/corruption/Publications/2013/Guidebook_on_anti-corruption_in_public_procurement_and_the_management_of_public_finances.pdf"]),
    ("Anti-Corruption in Public Procurement", ["https://www.unodc.org/documents/corruption/Publications/2013/Guidebook_on_anti-corruption_in_public_procurement_and_the_management_of_public_finances.pdf"]),
    ("Ethical Guidelines and Policies", ["https://www.icac.org.hk/icac/myeguide/pdf/policy_guide_full.pdf"]),
    ("Acting for the Rule of Law", ["https://grace.unodc.org/grace/uploads/documents/secondary/GRACE_Theatre_Guide_Acting_for_the_rule_of_law.PDF"]),
    ("Advanced Anti-Corruption Strategies", ["https://www.unodc.org/documents/corruption/Publications/2022/THE_TIME_IS_NOW_FR_FINAL_16.11.2022.pdf"]),
    ("Corruption in Public Finance Management", ["https://www.unodc.org/documents/corruption/Publications/2013/Guidebook_on_anti-corruption_in_public_procurement_and_the_management_of_public_finances.pdf"]),
    ("Global Perspectives on Anti-Corruption", ["https://www.unodc.org/documents/corruption/Publications/2016/V1508935.pdf", "https://www.unodc.org/documents/corruption/Publications/2022/THE_TIME_IS_NOW_FR_FINAL_16.11.2022.pdf"])
  ];
  
  // Mapping of course to their summaries and questions
  var courseSummaries: [(Text, Text)] = [];
  var courseQuestions: [(Text, [((Text, [Text]), Nat)])] = [];
  
  // Mapping of user to their completed courses
  var userCourses: [(Principal, [Text])] = [];
  
  // Function to get the list of predefined courses
  public query func getCourses() : async [Text] {
    courses
  };
  
  // Function to get summary and questions for the course using AI
  public func getCourseSummaryAndQuestions(course: Text) : async (Text, [((Text, [Text]), Nat)]) {
    let resources = Array.find(courseResources, func(x: (Text, [Text])) : Bool { x.0 == course });
    switch (resources) {
      case (null) { ("Course not found", []) };
      case (?(_, links)) {
        let summaryAndQuestions = callAIService(links);
        courseSummaries := Array.append(courseSummaries, [(course, summaryAndQuestions.0)]);
        courseQuestions := Array.append(courseQuestions, [(course, summaryAndQuestions.1)]);
        summaryAndQuestions
      };
    };
  };
  
  private func contains<T>(array: [T], value: T, equal: (T, T) -> Bool): Bool {
  for (item in array.vals()) {
    if (equal(item, value)) {
      return true;
    };
  };
  false
  };
  // Function to simulate AI summarization and question generation
  private func callAIService(resources: [Text]) : (Text, [((Text, [Text]), Nat)]) {
    // Simulate AI summary and question generation
    let summary = Array.foldLeft<Text, Text>(resources, "", func(acc, resource) { acc # resource # " " });
    let questions: [((Text, [Text]), Nat)] = [
      (("What is a key principle discussed in the document?", ["Transparency", "Obfuscation", "Negligence", "Evasion"]), 0),
      (("Which sector is targeted for anti-corruption efforts?", ["Public Sector", "Private Sector", "Education Sector", "Health Sector"]), 0),
      (("What is the main objective of the guide?", ["To promote integrity", "To hide information", "To support corruption", "To mislead public"]), 0),
      (("What strategy is recommended for preventing corruption?", ["Regular audits", "Ignoring issues", "Encouraging fraud", "Neglecting controls"]), 0),
      (("How should public finances be managed?", ["With transparency and accountability", "Secretly and without oversight", "Without any controls", "In a corrupt manner"]), 0)
    ];
    (summary, questions)
  };

  // Function to simulate token minting
  private func mintToken(user: Principal, course: Text) : Text {
    Debug.print("Minting token for user: " # Principal.toText(user) # " for course: " # course);
    "Token minted"
  };

  
public func validateAnswersAndMintToken(user: Principal, course: Text, answers: [Nat]) : async Bool {
    let questionsOpt = Array.find(courseQuestions, func(x: (Text, [((Text, [Text]), Nat)])) : Bool { x.0 == course });
    switch (questionsOpt) {
        case (null) { 
            false
        };
        case (?(_, questions)) {
            let correctAnswers = Array.map(questions, func(q: ((Text, [Text]), Nat)) : Nat { q.1 });
            if (answers == correctAnswers) {
                var userIndex = -1;
                var userFound = false;
                for (i in Iter.range(0, userCourses.size() - 1)) {
                    let (currentUser, _) = userCourses[i];
                    if (currentUser == user) {
                        userIndex := i;
                        userFound := true;
                    };
                };
                if (userFound) {
                    let (_, completedCourses) = userCourses[userIndex];
                    if (not contains<Text>(completedCourses, course, Text.equal)) {
                        let updatedCourses = Array.append(completedCourses, [course]);
                        userCourses := Array.tabulate(userCourses.size(), func (i: Nat) : (Principal, [Text]) {
                            if (i == userIndex) { (user, updatedCourses) } else { userCourses[i] }
                        });
                    };
                } else {
                    userCourses := Array.append(userCourses, [(user, [course])]);
                };
                let _ = mintToken(user, course);
                true
            } else {
                false
            }
        }
    }
};
}
