// api/kakao/skill.js
const macros = require("../../macros.json");

function makeResponse(text) {
  return {
    version: "2.0",
    template: {
      outputs: [{ simpleText: { text } }],
    },
  };
}

function parseCommand(utterance = "") {
  const u = String(utterance).trim();
  if (!u.startsWith("!")) return null;

  // ! 뒤를 trim하고, 첫 단어만 명령어로 사용
  const cmd = u.slice(1).trim().split(/\s+/)[0];
  return cmd || null;
}

module.exports = (req, res) => {
  // Vercel은 GET도 들어올 수 있어서 안전하게 처리
  if (req.method !== "POST") {
    return res.status(200).json(makeResponse("OK"));
  }

  // body가 객체로 오기도 하고 문자열로 오기도 해서 안전 처리
  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

  const utterance = body?.userRequest?.utterance ?? "";
  const cmd = parseCommand(utterance);

  // !로 시작 안 하면 안내(원하면 빈문자열로 바꿔도 됨)
  if (!cmd) {
    return res.status(200).json(makeResponse("명령은 !로 시작해줘. 예) !도움말"));
  }

  const reply = macros[cmd];

  // 없는 명령어 처리
  if (!reply) {
    return res.status(200).json(makeResponse(`"${cmd}" 데이터 없음. !도움말`));
  }

  return res.status(200).json(makeResponse(reply));
};
