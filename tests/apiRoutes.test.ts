import test from "node:test";
import assert from "node:assert";

test("API Routes Integration Test Suite", async (t) => {
  const baseUrl = "http://localhost:3000";

  await t.test("POST /api/translate processes text with emotional heat metrics", async () => {
    const res = await fetch(`${baseUrl}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Theek hai maan liya, your architecture is resilient.",
        fromLang: "hi",
        toLang: "en",
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.translatedText);
    assert.strictEqual(typeof data.heatDelta, "number");
    assert.strictEqual(data.isConcession, true);
  });

  await t.test("GET /api/room initializes and returns room state", async () => {
    const testRoom = "TEST_API_" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const res = await fetch(`${baseUrl}/api/room?roomId=${testRoom}`);

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.roomId, testRoom);
    assert.strictEqual(data.heatScore, 35);
  });

  await t.test("POST /api/room transmits message and updates room state", async () => {
    const testRoom = "TEST_MSG_" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const res = await fetch(`${baseUrl}/api/room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "message",
        roomId: testRoom,
        senderId: "debater-1",
        senderName: "Tester",
        senderLang: "en",
        targetLang: "hi",
        text: "This is a direct API argument transmission.",
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.room.roomId, testRoom);
    assert.strictEqual(data.room.messages.length, 1);
  });

  await t.test("POST /api/tts generates MP3 stream for neural speech synthesis", async () => {
    const res = await fetch(`${baseUrl}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Testing neural human voice generation.",
        lang: "en",
        heatScore: 50,
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("content-type"), "audio/mpeg");
    const arrayBuffer = await res.arrayBuffer();
    assert.ok(arrayBuffer.byteLength > 1000, `Expected audio bytes, got ${arrayBuffer.byteLength}`);
  });

  await t.test("POST /api/transcribe validates missing audio payload with 400", async () => {
    const res = await fetch(`${baseUrl}/api/transcribe`, {
      method: "POST",
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });
});
