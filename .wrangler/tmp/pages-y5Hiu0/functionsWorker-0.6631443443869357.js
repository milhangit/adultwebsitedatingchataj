var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/admin/adsterra.ts
var API_TOKEN = "3a2c2a04e69f8c8b5c9959b92c2ccfb8";
var BASE_URL = "https://api3.adsterratools.com/publisher";
var onRequestGet = /* @__PURE__ */ __name(async (context) => {
  try {
    const startDate = /* @__PURE__ */ new Date();
    startDate.setDate(startDate.getDate() - 30);
    const startStr = startDate.toISOString().split("T")[0];
    const endStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const url = `${BASE_URL}/statistics.json?start_date=${startStr}&finish_date=${endStr}&group_by=date`;
    console.log(`Fetching Adsterra stats: ${url}`);
    const res = await fetch(url, {
      headers: {
        "X-API-Key": API_TOKEN
      }
    });
    if (res.ok) {
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    }
    console.warn(`Adsterra API failed (${res.status}), returning mock data.`);
    const mockData = {
      totals: {
        impressions: 12500,
        clicks: 342,
        ctr: 2.73,
        revenue: 45.2,
        cpm: 3.61
      },
      items: [
        { date: endStr, impressions: 450, clicks: 12, revenue: 1.5, ctr: 2.6, cpm: 3.33 },
        { date: startStr, impressions: 400, clicks: 10, revenue: 1.35, ctr: 2.5, cpm: 3.37 }
      ],
      _is_mock: true
      // Flag to indicate mock data in UI
    };
    return new Response(JSON.stringify(mockData), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");

// api/admin/chat.ts
var onRequestGet2 = /* @__PURE__ */ __name(async (context) => {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(`
            SELECT m.*, p.name as profile_name 
            FROM messages m 
            JOIN profiles p ON m.profile_id = p.id 
            ORDER BY m.created_at DESC 
            LIMIT 50
        `).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");

// utils/db.ts
var getDB = /* @__PURE__ */ __name((context) => {
  const { request, env } = context;
  const sessionToken = request.headers.get("D1-Session");
  return sessionToken ? env.DB.withSession(sessionToken) : env.DB;
}, "getDB");

// api/admin/guests.ts
var onRequestGet3 = /* @__PURE__ */ __name(async (context) => {
  try {
    const db = getDB(context);
    const { results } = await db.prepare(
      "SELECT * FROM users ORDER BY created_at DESC"
    ).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");

// api/admin/reports.ts
var onRequestGet4 = /* @__PURE__ */ __name(async (context) => {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM reports ORDER BY created_at DESC"
    ).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");

// api/admin/stats.ts
var onRequestGet5 = /* @__PURE__ */ __name(async (context) => {
  const { env } = context;
  try {
    const totalUsers = await env.DB.prepare("SELECT COUNT(*) as count FROM profiles").first("count");
    const activeMatches = Math.floor(Number(totalUsers) * 0.3);
    const revenue = 4500;
    return new Response(JSON.stringify({
      totalUsers,
      activeMatches,
      revenue
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");

// api/admin/users.ts
var onRequestGet6 = /* @__PURE__ */ __name(async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  try {
    const db = getDB(context);
    let query = "SELECT * FROM profiles";
    if (status !== "all") {
      query += " WHERE isVerified = FALSE";
    }
    query += " ORDER BY created_at DESC";
    const { results } = await db.prepare(query).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");
var onRequestPut = /* @__PURE__ */ __name(async (context) => {
  const { request } = context;
  try {
    const { id, updates } = await request.json();
    if (!id || !updates) {
      return new Response(JSON.stringify({ error: "Missing id or updates" }), { status: 400 });
    }
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const db = getDB(context);
    const query = `UPDATE profiles SET ${setClause} WHERE id = ?`;
    const { success } = await db.prepare(query).bind(...values, id).run();
    return new Response(JSON.stringify({ success }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestPut");
var onRequestPost = /* @__PURE__ */ __name(async (context) => {
  const { request } = context;
  try {
    const body = await request.json();
    const { action } = body;
    const db = getDB(context);
    if (action === "approve" || action === "reject") {
      const { id } = body;
      if (action === "approve") {
        await db.prepare("UPDATE profiles SET isVerified = TRUE WHERE id = ?").bind(id).run();
      } else if (action === "reject") {
        await db.prepare("DELETE FROM profiles WHERE id = ?").bind(id).run();
      }
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } else if (action === "toggle_online") {
      const { id, is_online } = body;
      await db.prepare("UPDATE profiles SET is_online = ? WHERE id = ?").bind(is_online ? 1 : 0, id).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } else if (action === "create") {
      const { profile } = body;
      const { name, age, gender, location, occupation, height, education, imageUrl, bio, family, preferences, religion, caste, email } = profile;
      const { success } = await db.prepare(`
                INSERT INTO profiles (name, age, gender, location, occupation, height, education, imageUrl, isVerified, religion, caste, bio, family, preferences, images, email, created_at, last_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `).bind(
        name,
        age,
        gender,
        location,
        occupation,
        height,
        education,
        imageUrl,
        religion,
        caste,
        bio,
        family,
        preferences,
        JSON.stringify([imageUrl]),
        email
      ).run();
      return new Response(JSON.stringify({ success }), { headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestPost");

// api/auth/register-guest.ts
var onRequestPost2 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { phone, name, image } = body;
    if (!phone || !name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const ip = request.headers.get("CF-Connecting-IP") || "Unknown";
    const userAgent = request.headers.get("User-Agent") || "Unknown";
    const country = request.headers.get("CF-IPCountry") || "Unknown";
    const city = request.headers.get("CF-IPCity") || "Unknown";
    const deviceType = /mobile/i.test(userAgent) ? "Mobile" : "Desktop";
    const db = env.DB;
    const userId = "guest_" + Date.now() + "_" + Math.floor(Math.random() * 1e3);
    await db.prepare(`
            INSERT INTO users (user_id, phone, name, image_url, ip_address, user_agent, country, city, device_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(userId, phone, name, image, ip, userAgent, country, city, deviceType).run();
    return new Response(JSON.stringify({ userId, name, phone }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestPost");

// api/chat/generate.ts
var onRequestPost3 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  try {
    const { profile, userMessage, history } = await request.json();
    if (!profile || !userMessage) {
      return new Response(JSON.stringify({ error: "Missing profile or userMessage" }), { status: 400 });
    }
    const systemPrompt = `
You are ${profile.name}, a ${profile.age} year old ${profile.gender} from ${profile.location}.
Occupation: ${profile.occupation}.
Bio: ${profile.bio}.
Family: ${profile.family}.
Preferences: ${profile.preferences}.
Religion: ${profile.religion}.
Caste: ${profile.caste}.

You are chatting on a matrimonial site called DateSL.
Your goal is to get to know the other person and see if you are a match.
Be friendly, polite, but also realistic.

CRITICAL INSTRUCTION ON LANGUAGE:
Detect the language of the user's last message.
- If the user speaks Sinhala (e.g., "Kohomada"), reply in Sinhala.
- If the user speaks Singlish (Sinhala in English letters, e.g., "Oya koheda wada karanne"), reply in Singlish.
- If the user speaks Tamil (e.g., "Vanakkam"), reply in Tamil.
- If the user speaks Tamil-English (Tamil in English letters, e.g., "Epdi irukeenga"), reply in Tamil-English.
- If the user speaks English, reply in English.

Do NOT explicitly state which language you are switching to. Just reply in that language naturally.
Keep your response concise (under 3 sentences) and engaging.
        `.trim();
    const messages = [
      { role: "system", content: systemPrompt },
      // ...history.map((msg: any) => ({
      //     role: msg.sender === 'user' ? 'user' : 'assistant',
      //     content: msg.text
      // })),
      { role: "user", content: userMessage }
    ];
    const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages,
      stream: false
    });
    const reply = response.response;
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestPost");

// api/profiles/[id].ts
var onRequestGet7 = /* @__PURE__ */ __name(async (context) => {
  const { params, env } = context;
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Profile ID is required" }), { status: 400 });
  }
  try {
    const profile = await env.DB.prepare("SELECT * FROM profiles WHERE id = ?").bind(id).first();
    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(profile), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");

// api/assets/[[path]].ts
var onRequestGet8 = /* @__PURE__ */ __name(async (context) => {
  const { request, env, params } = context;
  const pathArray = params.path;
  const key = pathArray.join("/");
  if (!key) {
    return new Response("Missing key", { status: 400 });
  }
  try {
    const object = await env.R2.get(key);
    if (!object) {
      return new Response("Object Not Found", { status: 404 });
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    return new Response(object.body, {
      headers
    });
  } catch (error) {
    console.error("Asset Fetch Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}, "onRequestGet");

// api/chat.ts
var onRequestPost4 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { message, profileId } = body;
    if (!message || !profileId) {
      return new Response(JSON.stringify({ error: "Missing message or profileId" }), { status: 400 });
    }
    let responseText = "I'm sorry, I can't answer that right now.";
    if (env.AI) {
      const systemPrompt = `You are a Sri Lankan matrimonial profile assistant. You are polite, traditional, and value family. 
      You are responding on behalf of a profile ID ${profileId}. 
      Keep answers short (under 50 words) and culturally appropriate for a matrimonial site.`;
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ];
      const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", { messages });
      if (aiResponse && aiResponse.response) {
        responseText = aiResponse.response;
      }
    } else {
      responseText = "AI binding not found. Please configure Cloudflare Workers AI.";
    }
    return new Response(JSON.stringify({ response: responseText }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestPost");

// api/conversations.ts
var onRequestGet9 = /* @__PURE__ */ __name(async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  try {
    const db = getDB(context);
    const query = `
            SELECT 
                p.id, 
                p.name, 
                p.imageUrl, 
                m.content as lastMessage, 
                m.created_at as lastMessageTime,
                m.is_user_message
            FROM profiles p
            JOIN (
                SELECT 
                    receiver_id, 
                    content, 
                    created_at, 
                    is_user_message,
                    ROW_NUMBER() OVER (PARTITION BY receiver_id ORDER BY created_at DESC) as rn
                FROM messages
            ) m ON p.id = m.receiver_id
            WHERE m.rn = 1
            ORDER BY m.created_at DESC
        `;
    const { results } = await db.prepare(query).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");

// api/heartbeat.ts
var onRequestPost5 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  try {
    const { profileId } = await request.json();
    if (profileId) {
      await env.DB.prepare(
        "UPDATE profiles SET last_active = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(profileId).run();
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestPost");

// api/messages.ts
var onRequestGet10 = /* @__PURE__ */ __name(async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const profileId = url.searchParams.get("profileId");
  const userId = url.searchParams.get("userId");
  if (!profileId || !userId) {
    return new Response(JSON.stringify({ error: "Missing profileId or userId" }), { status: 400 });
  }
  try {
    const db = getDB(context);
    const { results } = await db.prepare(
      "SELECT * FROM messages WHERE profile_id = ? AND user_id = ? ORDER BY created_at ASC"
    ).bind(profileId, userId).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");
var onRequestPost6 = /* @__PURE__ */ __name(async (context) => {
  const { request } = context;
  try {
    const { profile_id, user_id, content, is_user_message } = await request.json();
    if (!profile_id || !user_id || !content) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const db = getDB(context);
    const { success } = await db.prepare(
      "INSERT INTO messages (profile_id, user_id, content, is_user_message) VALUES (?, ?, ?, ?)"
    ).bind(profile_id, user_id, content, is_user_message).run();
    return new Response(JSON.stringify({ success }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestPost");

// api/profiles/index.ts
var onRequestGet11 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = url.searchParams;
  const gender = params.get("gender");
  const minAge = parseInt(params.get("minAge") || "18");
  const maxAge = parseInt(params.get("maxAge") || "100");
  const location = params.get("location");
  const caste = params.get("caste");
  const religion = params.get("religion");
  const page = parseInt(params.get("page") || "1");
  const limit = 6;
  const offset = (page - 1) * limit;
  let query = "SELECT * FROM profiles WHERE age >= ? AND age <= ?";
  const queryParams = [minAge, maxAge];
  if (gender && gender !== "Any") {
    query += " AND gender = ?";
    queryParams.push(gender);
  }
  if (location && location !== "Any Location") {
    query += " AND location = ?";
    queryParams.push(location);
  }
  if (caste && caste !== "Any") {
    query += " AND caste = ?";
    queryParams.push(caste);
  }
  if (religion) {
    const religions = religion.split(",");
    if (religions.length > 0) {
      const placeholders = religions.map(() => "?").join(",");
      query += ` AND religion IN (${placeholders})`;
      queryParams.push(...religions);
    }
  }
  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);
  try {
    const { results } = await env.DB.prepare(query).bind(...queryParams).all();
    let countQuery = "SELECT COUNT(*) as total FROM profiles WHERE age >= ? AND age <= ?";
    const countParams = [minAge, maxAge];
    if (gender && gender !== "Any") {
      countQuery += " AND gender = ?";
      countParams.push(gender);
    }
    if (location && location !== "Any Location") {
      countQuery += " AND location = ?";
      countParams.push(location);
    }
    if (caste && caste !== "Any") {
      countQuery += " AND caste = ?";
      countParams.push(caste);
    }
    if (religion) {
      const religions = religion.split(",");
      if (religions.length > 0) {
        const placeholders = religions.map(() => "?").join(",");
        countQuery += ` AND religion IN (${placeholders})`;
        countParams.push(...religions);
      }
    }
    const countResult = await env.DB.prepare(countQuery).bind(...countParams).first();
    const total = countResult?.total || 0;
    return new Response(JSON.stringify({
      profiles: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(Number(total) / limit)
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestGet");

// api/upload.ts
var onRequestPost7 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }
    const filename = file.name;
    const extension = filename.split(".").pop();
    const uniqueId = crypto.randomUUID();
    const key = `images/${uniqueId}.${extension}`;
    await env.R2.put(key, file);
    const url = `/api/assets/${key}`;
    return new Response(JSON.stringify({ url, key }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}, "onRequestPost");

// ../.wrangler/tmp/pages-y5Hiu0/functionsRoutes-0.8893122114075728.mjs
var routes = [
  {
    routePath: "/api/admin/adsterra",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/admin/chat",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/admin/guests",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/admin/reports",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/admin/stats",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/auth/register-guest",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/chat/generate",
    mountPath: "/api/chat",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/profiles/:id",
    mountPath: "/api/profiles",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/assets/:path*",
    mountPath: "/api/assets",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/api/chat",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/conversations",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/api/heartbeat",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/messages",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet10]
  },
  {
    routePath: "/api/messages",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/profiles",
    mountPath: "/api/profiles",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet11]
  },
  {
    routePath: "/api/upload",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
