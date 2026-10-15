import test from "node:test";
import assert from "node:assert";
import { RoomStore } from "../lib/roomStore";

test("RoomStore Multi-Party State Engine Test Suite", async (t) => {
  const testRoomId = "TEST-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  await t.test("getOrCreateRoom creates an initial synchronized room state", () => {
    const room = RoomStore.getOrCreateRoom(testRoomId, "Microservices vs Monolith");
    assert.strictEqual(room.roomId, testRoomId);
    assert.strictEqual(room.topic, "Microservices vs Monolith");
    assert.strictEqual(room.heatScore, 35);
    assert.strictEqual(room.messages.length, 0);
    assert.strictEqual(room.debaterA.name, "Debater 1");
    assert.strictEqual(room.debaterB.name, "Debater 2");
  });

  await t.test("updateDebater updates debater profile information", () => {
    const stateA = RoomStore.updateDebater(testRoomId, "debater-1", { name: "Alice", lang: "en" });
    assert.strictEqual(stateA.debaterA.name, "Alice");
    assert.strictEqual(stateA.debaterA.lang, "en");

    const stateB = RoomStore.updateDebater(testRoomId, "debater-2", { name: "Bob", lang: "hi" });
    assert.strictEqual(stateB.debaterB.name, "Bob");
    assert.strictEqual(stateB.debaterB.lang, "hi");
  });

  await t.test("postMessage appends transcript and adjusts room heat score", () => {
    const state = RoomStore.postMessage(testRoomId, {
      id: "msg-1",
      senderId: "debater-1",
      senderName: "Alice",
      senderLang: "en",
      originalText: "I completely disagree with your stance!",
      translatedText: "मैं आपके रुख से पूरी तरह असहमत हूँ!",
      targetLang: "hi",
      timestamp: Date.now(),
      emotion: "furious",
      heatDelta: 15,
      isInterruption: false,
      isConcession: false,
    });

    assert.ok(state);
    assert.strictEqual(state.messages.length, 1);
    assert.strictEqual(state.heatScore, 50); // 35 + 15
    assert.strictEqual(state.activeSpeakerId, "debater-1");
  });

  await t.test("triggerInterruption records interruption and spikes thermal metric", () => {
    const state = RoomStore.triggerInterruption(testRoomId, "debater-2", "Bob");
    assert.ok(state);
    assert.ok(state.interruptionNotice);
    assert.strictEqual(state.interruptionNotice?.interrupterName, "Bob");
    assert.strictEqual(state.interruptionNotice?.interruptedName, "Alice");
    assert.strictEqual(state.heatScore, 65); // 50 + 15
    assert.strictEqual(state.activeSpeakerId, "debater-2");
  });

  await t.test("postMessage with concession updates immutable common ground ledger", () => {
    const state = RoomStore.postMessage(testRoomId, {
      id: "msg-concession",
      senderId: "debater-2",
      senderName: "Bob",
      senderLang: "hi",
      originalText: "Theek hai maan liya, latency is better on monolith.",
      translatedText: "Alright I concede, latency is better on monolith.",
      targetLang: "en",
      timestamp: Date.now(),
      emotion: "conceding",
      heatDelta: -20,
      isInterruption: false,
      isConcession: true,
      concessionSummary: "Conceded that in-memory monolithic calls eliminate network serialization latency.",
    });

    assert.ok(state);
    assert.strictEqual(state.commonGroundLedger.length, 1);
    assert.strictEqual(state.commonGroundLedger[0].concededBy, "Bob");
    assert.ok(state.debaterB.stance < 90, "Stance should decrease upon concession");
  });
});
