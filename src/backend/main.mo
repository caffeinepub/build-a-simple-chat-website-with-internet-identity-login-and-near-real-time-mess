import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Map "mo:core/Map";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type DisplayName = Text;
  type QuestionContent = Text;
  type AnswerContent = Text;
  type Timestamp = Time.Time;

  type QuestionId = Nat;

  type Question = {
    id : QuestionId;
    author : Principal;
    displayName : ?DisplayName;
    content : QuestionContent;
    answer : ?AnswerContent;
    created : Timestamp;
    modified : ?Timestamp;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextQuestionId = 0;

  let maxQuestionLength = 500;
  let maxAnswerLength = 1000;

  let questions = Map.empty<Principal, List.List<Question>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getUserQuestions(user : Principal) : List.List<Question> {
    switch (questions.get(user)) {
      case (?userQuestions) { userQuestions };
      case (null) {
        let emptyList = List.empty<Question>();
        questions.add(user, emptyList);
        emptyList;
      };
    };
  };

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Q&A functions with proper authorization
  public shared ({ caller }) func createQuestion(displayName : ?DisplayName, content : QuestionContent) : async QuestionId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create questions");
    };

    if (content.size() == 0) Runtime.trap("Question cannot be empty");
    if (content.size() > maxQuestionLength) {
      Runtime.trap("Question exceeds the maximum length of 500 characters");
    };

    let question : Question = {
      id = nextQuestionId;
      author = caller;
      displayName;
      content;
      answer = null;
      created = Time.now();
      modified = null;
    };

    let userQuestions = getUserQuestions(caller);
    userQuestions.add(question);
    questions.add(caller, userQuestions);

    nextQuestionId += 1;
    question.id;
  };

  public query ({ caller }) func getQuestions(limit : Nat, offset : Nat) : async [Question] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view questions");
    };

    let userQuestions = getUserQuestions(caller);
    let allQuestions = userQuestions.toArray();
    let end = if (offset + limit > allQuestions.size()) {
      allQuestions.size();
    } else {
      offset + limit;
    };
    allQuestions.sliceToArray(offset, end);
  };

  public shared ({ caller }) func answerQuestion(questionId : QuestionId, answer : AnswerContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can answer questions");
    };

    if (answer.size() == 0) Runtime.trap("Answer cannot be empty");
    if (answer.size() > maxAnswerLength) {
      Runtime.trap("Answer exceeds the maximum length of 1,000 characters");
    };

    let userQuestions = getUserQuestions(caller);
    let questionToUpdate = userQuestions.find(func(q) { q.id == questionId });

    switch (questionToUpdate) {
      case (?_existingQuestion) {
        let updatedQuestions = userQuestions.map<Question, Question>(
          func(q) {
            if (q.id == questionId) {
              { q with answer = ?answer; modified = ?Time.now() };
            } else {
              q;
            };
          }
        );
        questions.add(caller, updatedQuestions);
      };
      case (null) { Runtime.trap("Question not found") };
    };
  };
};
