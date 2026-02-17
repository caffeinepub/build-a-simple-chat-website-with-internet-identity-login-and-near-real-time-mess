import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  public func run(old : OldActor) : NewActor {
    let questions : Map.Map<Principal, List.List<Question>> = Map.empty<Principal, List.List<Question>>();
    let userProfiles : Map.Map<Principal, UserProfile> = Map.empty<Principal, UserProfile>();
    let accessControlState = AccessControl.initState();
    { 
      questions; 
      nextQuestionId = 0;
      userProfiles;
      accessControlState;
    };
  };

  type OldActor = {
    messages : List.List<{
      author : Principal;
      displayName : ?Text;
      content : Text;
      timestamp : Int;
    }>;
    messageTimestamps : Map.Map<Principal, Int>;
    maxMessageLength : Nat;
    minMessageInterval : Nat;
  };
  
  type NewActor = {
    questions : Map.Map<Principal, List.List<Question>>;
    nextQuestionId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    accessControlState : AccessControl.AccessControlState;
  };

  type QuestionId = Nat;

  type Question = {
    id : QuestionId;
    author : Principal;
    displayName : ?Text;
    content : Text;
    answer : ?Text;
    created : Int;
    modified : ?Int;
  };

  type UserProfile = {
    name : Text;
  };
};
