import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
  type DisplayName = Text;
  type MessageContent = Text;
  type Timestamp = Time.Time;

  type ChatMessage = {
    author : Principal;
    displayName : ?DisplayName;
    content : MessageContent;
    timestamp : Timestamp;
  };

  let messages = List.empty<ChatMessage>();
  let messageTimestamps = Map.empty<Principal, Time.Time>();

  let maxMessageLength = 500;
  let minMessageInterval = 1_000_000_000; // 1 second in nanoseconds

  module ChatMessage {
    public func compare(msg1 : ChatMessage, msg2 : ChatMessage) : Order.Order {
      if (msg1.timestamp < msg2.timestamp) {
        #less;
      } else if (msg1.timestamp > msg2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  public shared ({ caller }) func sendMessage(displayName : ?DisplayName, content : MessageContent) : async () {
    let trimmedContent = trimText(content);

    if (trimmedContent.size() == 0) Runtime.trap("Empty messages are not allowed");
    if (trimmedContent.size() > maxMessageLength) {
      Runtime.trap("Message exceeds the maximum length of 500");
    };

    let currentTime = Time.now();

    switch (messageTimestamps.get(caller)) {
      case (?lastTime) {
        if (currentTime - lastTime < minMessageInterval) {
          Runtime.trap("Please wait a moment before sending another message");
        };
      };
      case (null) {};
    };

    let message : ChatMessage = {
      author = caller;
      displayName;
      content = trimmedContent;
      timestamp = currentTime;
    };

    messages.add(message);
    messageTimestamps.add(caller, currentTime);
  };

  public query ({ caller }) func getMessages(limit : Nat, offset : Nat) : async [ChatMessage] {
    messages.toArray().sliceToArray(offset, offset + limit);
  };

  func trimText(text : Text) : Text {
    let emptyText : Text = "";
    text.trimStart(#char(' ')).trimEnd(#char(' '));
  };
};
