/**
 * Clevermom Apps Script - paste-ready Code.gs
 *
 * Cara pakai:
 * 1. Buat Google Sheets dengan sheet konten sesuai CSV template:
 *    service_categories, services, promos, packages, testimonials,
 *    featured_treatments, about_values, branches, help_topics, site_content.
 * 2. Buka Extensions -> Apps Script.
 * 3. Paste seluruh isi file ini ke Code.gs.
 * 4. Di Apps Script, buka Project Settings -> Script properties:
 *    APPS_SCRIPT_API_KEY = secret yang sama dengan .env.local APPS_SCRIPT_API_KEY.
 * 5. Deploy -> New deployment -> Web app:
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Pakai URL deployment sebagai APPS_SCRIPT_URL.
 */

const CONFIG = {
  apiKeyProperty: "APPS_SCRIPT_API_KEY",
  contentSheets: {
    serviceCategories: "service_categories",
    services: "services",
    promos: "promos",
    packages: "packages",
    testimonials: "testimonials",
    featuredTreatments: "featured_treatments",
    aboutValues: "about_values",
    branches: "branches",
    helpTopics: "help_topics",
    siteContent: "site_content",
  },
  storeSheets: {
    members: {
      name: "members",
      headers: ["userId", "email", "name", "image", "lastLoginAt", "updatedAt"],
    },
    serviceComments: {
      name: "service_comments",
      headers: ["id", "serviceId", "author", "message", "createdAt", "userId", "authorMode"],
    },
    serviceCommentLikes: {
      name: "service_comment_likes",
      headers: ["commentId", "userId", "createdAt"],
    },
    serviceRecommendations: {
      name: "service_recommendations",
      headers: ["serviceId", "userId", "createdAt"],
    },
    testimonialReactions: {
      name: "testimonial_reactions",
      headers: ["testimonialId", "userId", "createdAt"],
    },
  },
};

function doGet() {
  return jsonResponse(buildContentPayload());
}

function doPost(e) {
  try {
    const payload = parsePostPayload(e);
    assertAuthorized(payload.apiKey);

    const action = normalizeText(payload.action);
    if (!action) {
      return jsonResponse({ ok: false, message: "Missing action" });
    }

    const result = routeAction(action, payload);
    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    return jsonResponse({
      ok: false,
      message: error && error.message ? error.message : "Apps Script request failed.",
    });
  }
}

function buildContentPayload() {
  const siteContent = readSiteContent();

  return {
    ...siteContent,
    services: readRows(CONFIG.contentSheets.serviceCategories).map(normalizeContentRow),
    serviceList: readRows(CONFIG.contentSheets.services).map(normalizePackageDetailsIfNeeded),
    promos: readRows(CONFIG.contentSheets.promos).map(normalizeContentRow),
    packages: readRows(CONFIG.contentSheets.packages).map(normalizePackageRow),
    testimonials: readRows(CONFIG.contentSheets.testimonials).map(normalizeContentRow),
    featuredTreatments: readRows(CONFIG.contentSheets.featuredTreatments).map(normalizeContentRow),
    about: {
      ...(siteContent.about || {}),
      values: readRows(CONFIG.contentSheets.aboutValues).map(normalizeContentRow),
      branches: readRows(CONFIG.contentSheets.branches).map(normalizeContentRow),
    },
    help: {
      ...(siteContent.help || {}),
      topics: readRows(CONFIG.contentSheets.helpTopics).map(normalizeContentRow),
    },
  };
}

function routeAction(action, payload) {
  switch (action) {
    case "upsertMember":
      return { member: upsertMember(payload) };
    case "updateMemberName":
      return { member: updateMemberName(payload) };
    case "getServiceComments":
      return {
        comments: getServiceComments(
          normalizeText(payload.serviceId),
          normalizeText(payload.viewerUserId),
        ),
      };
    case "getAllServiceComments":
      return { comments: getAllServiceComments() };
    case "addServiceComment":
      return { comment: addServiceComment(payload.comment || payload) };
    case "addServiceCommentLike":
      return {
        like: addServiceCommentLike(
          normalizeText(payload.commentId),
          normalizeText(payload.userId),
        ),
      };
    case "removeServiceCommentLike":
      return {
        like: removeServiceCommentLike(
          normalizeText(payload.commentId),
          normalizeText(payload.userId),
        ),
      };
    case "getServiceRecommendation":
      return {
        recommendation: getServiceRecommendation(
          normalizeText(payload.serviceId),
          normalizeText(payload.viewerUserId),
        ),
      };
    case "getAllServiceRecommendations":
      return { recommendations: getAllServiceRecommendations() };
    case "addServiceRecommendation":
      return {
        recommendation: addServiceRecommendation(
          normalizeText(payload.serviceId),
          normalizeText(payload.userId),
        ),
      };
    case "removeServiceRecommendation":
      return {
        recommendation: removeServiceRecommendation(
          normalizeText(payload.serviceId),
          normalizeText(payload.userId),
        ),
      };
    case "getTestimonialReaction":
      return {
        reaction: getTestimonialReaction(
          normalizeText(payload.testimonialId),
          normalizeText(payload.viewerUserId),
        ),
      };
    case "getTestimonialReactions":
      return {
        reactions: getTestimonialReactions(
          Array.isArray(payload.testimonialIds) ? payload.testimonialIds.map(normalizeText) : [],
          normalizeText(payload.viewerUserId),
        ),
      };
    case "addTestimonialReaction":
      return {
        reaction: addTestimonialReaction(
          normalizeText(payload.testimonialId),
          normalizeText(payload.userId),
        ),
      };
    case "removeTestimonialReaction":
      return {
        reaction: removeTestimonialReaction(
          normalizeText(payload.testimonialId),
          normalizeText(payload.userId),
        ),
      };
    default:
      throw new Error("Unsupported action");
  }
}

function upsertMember(payload) {
  const userId = requireText(payload.userId, "userId wajib ada.");
  const email = normalizeText(payload.email);
  const now = new Date().toISOString();
  const sheet = ensureStoreSheet(CONFIG.storeSheets.members);
  const rows = readSheetRows(sheet);
  const existing = rows.find((row) => row.userId === userId);
  const member = {
    userId,
    email,
    name: normalizeText(payload.name),
    image: normalizeText(payload.image),
    lastLoginAt: normalizeText(payload.lastLoginAt) || now,
    updatedAt: existing ? existing.updatedAt || now : now,
  };

  upsertRowByKey(sheet, "userId", userId, member);
  return member;
}

function updateMemberName(payload) {
  const userId = requireText(payload.userId, "userId wajib ada.");
  const now = new Date().toISOString();
  const sheet = ensureStoreSheet(CONFIG.storeSheets.members);
  const rows = readSheetRows(sheet);
  const existing = rows.find((row) => row.userId === userId) || {};
  const member = {
    userId,
    email: normalizeText(payload.email) || existing.email,
    name: requireText(payload.name, "name wajib ada."),
    image: existing.image || "",
    lastLoginAt: existing.lastLoginAt || now,
    updatedAt: normalizeText(payload.updatedAt) || now,
  };

  upsertRowByKey(sheet, "userId", userId, member);
  return member;
}

function getServiceComments(serviceId, viewerUserId) {
  const comments = getAllServiceComments().filter((comment) => comment.serviceId === serviceId);
  return comments.map((comment) => withCommentLikeSummary(comment, viewerUserId));
}

function getAllServiceComments() {
  const sheet = ensureStoreSheet(CONFIG.storeSheets.serviceComments);
  const comments = readSheetRows(sheet)
    .filter((row) => row.id && row.serviceId && row.message)
    .map((row) => withCommentLikeSummary({
      id: normalizeText(row.id),
      serviceId: normalizeText(row.serviceId),
      author: normalizeText(row.author) || "Akun Mom",
      message: normalizeText(row.message),
      createdAt: normalizeText(row.createdAt),
      userId: normalizeText(row.userId),
      authorMode: normalizeText(row.authorMode),
    }));

  return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function addServiceComment(input) {
  const serviceId = requireText(input.serviceId, "serviceId wajib ada.");
  const message = requireText(input.message, "message wajib ada.");
  const comment = {
    id: normalizeText(input.id) || Utilities.getUuid(),
    serviceId,
    author: normalizeText(input.author) || "Akun Mom",
    message,
    createdAt: normalizeText(input.createdAt) || new Date().toISOString(),
    userId: normalizeText(input.userId),
    authorMode: normalizeText(input.authorMode) || "account",
  };

  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const sheet = ensureStoreSheet(CONFIG.storeSheets.serviceComments);
    appendObjectRow(sheet, comment);
  } finally {
    lock.releaseLock();
  }

  return withCommentLikeSummary(comment, comment.userId);
}

function addServiceCommentLike(commentId, userId) {
  requireText(commentId, "commentId wajib ada.");
  requireText(userId, "userId wajib ada.");

  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const sheet = ensureStoreSheet(CONFIG.storeSheets.serviceCommentLikes);
    const exists = readSheetRows(sheet).some(
      (row) => row.commentId === commentId && row.userId === userId,
    );
    if (!exists) {
      appendObjectRow(sheet, { commentId, userId, createdAt: new Date().toISOString() });
    }
  } finally {
    lock.releaseLock();
  }

  return getCommentLikeSummary(commentId, userId);
}

function removeServiceCommentLike(commentId, userId) {
  requireText(commentId, "commentId wajib ada.");
  requireText(userId, "userId wajib ada.");

  const sheet = ensureStoreSheet(CONFIG.storeSheets.serviceCommentLikes);
  deleteRowsWhere(sheet, (row) => row.commentId === commentId && row.userId === userId);
  return getCommentLikeSummary(commentId, userId);
}

function withCommentLikeSummary(comment, viewerUserId) {
  const summary = getCommentLikeSummary(comment.id, viewerUserId);
  return {
    ...comment,
    likeCount: summary.likeCount,
    likedByCurrentUser: summary.likedByCurrentUser,
  };
}

function getCommentLikeSummary(commentId, viewerUserId) {
  const sheet = ensureStoreSheet(CONFIG.storeSheets.serviceCommentLikes);
  const likes = readSheetRows(sheet).filter((row) => row.commentId === commentId);
  return {
    commentId,
    likeCount: unique(likes.map((row) => row.userId)).length,
    likedByCurrentUser: Boolean(viewerUserId && likes.some((row) => row.userId === viewerUserId)),
  };
}

function getServiceRecommendation(serviceId, viewerUserId) {
  const sheet = ensureStoreSheet(CONFIG.storeSheets.serviceRecommendations);
  const rows = readSheetRows(sheet).filter((row) => row.serviceId === serviceId);
  return {
    serviceId,
    recommendationCount: unique(rows.map((row) => row.userId)).length,
    recommendedByCurrentUser: Boolean(viewerUserId && rows.some((row) => row.userId === viewerUserId)),
  };
}

function getAllServiceRecommendations() {
  const sheet = ensureStoreSheet(CONFIG.storeSheets.serviceRecommendations);
  const rows = readSheetRows(sheet);
  return unique(rows.map((row) => row.serviceId))
    .filter(Boolean)
    .map((serviceId) => getServiceRecommendation(serviceId));
}

function addServiceRecommendation(serviceId, userId) {
  requireText(serviceId, "serviceId wajib ada.");
  requireText(userId, "userId wajib ada.");
  addUniqueRelation(CONFIG.storeSheets.serviceRecommendations, { serviceId, userId });
  return getServiceRecommendation(serviceId, userId);
}

function removeServiceRecommendation(serviceId, userId) {
  requireText(serviceId, "serviceId wajib ada.");
  requireText(userId, "userId wajib ada.");
  const sheet = ensureStoreSheet(CONFIG.storeSheets.serviceRecommendations);
  deleteRowsWhere(sheet, (row) => row.serviceId === serviceId && row.userId === userId);
  return getServiceRecommendation(serviceId, userId);
}

function getTestimonialReaction(testimonialId, viewerUserId) {
  const sheet = ensureStoreSheet(CONFIG.storeSheets.testimonialReactions);
  const rows = readSheetRows(sheet).filter((row) => row.testimonialId === testimonialId);
  return {
    testimonialId,
    reactionCount: unique(rows.map((row) => row.userId)).length,
    reactedByCurrentUser: Boolean(viewerUserId && rows.some((row) => row.userId === viewerUserId)),
  };
}

function getTestimonialReactions(testimonialIds, viewerUserId) {
  return unique(testimonialIds)
    .filter(Boolean)
    .map((testimonialId) => getTestimonialReaction(testimonialId, viewerUserId));
}

function addTestimonialReaction(testimonialId, userId) {
  requireText(testimonialId, "testimonialId wajib ada.");
  requireText(userId, "userId wajib ada.");
  addUniqueRelation(CONFIG.storeSheets.testimonialReactions, { testimonialId, userId });
  return getTestimonialReaction(testimonialId, userId);
}

function removeTestimonialReaction(testimonialId, userId) {
  requireText(testimonialId, "testimonialId wajib ada.");
  requireText(userId, "userId wajib ada.");
  const sheet = ensureStoreSheet(CONFIG.storeSheets.testimonialReactions);
  deleteRowsWhere(sheet, (row) => row.testimonialId === testimonialId && row.userId === userId);
  return getTestimonialReaction(testimonialId, userId);
}

function addUniqueRelation(sheetConfig, relation) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const sheet = ensureStoreSheet(sheetConfig);
    const rows = readSheetRows(sheet);
    const exists = rows.some((row) =>
      Object.keys(relation).every((key) => row[key] === relation[key]),
    );
    if (!exists) {
      appendObjectRow(sheet, { ...relation, createdAt: new Date().toISOString() });
    }
  } finally {
    lock.releaseLock();
  }
}

function readSiteContent() {
  return readRows(CONFIG.contentSheets.siteContent).reduce((sections, row) => {
    const section = normalizeText(row.section);
    const key = normalizeText(row.key);
    if (!section || !key) return sections;

    sections[section] = sections[section] || {};
    sections[section][key] = normalizeText(row.value);
    return sections;
  }, {});
}

function readRows(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) return [];
  return readSheetRows(sheet);
}

function readSheetRows(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map((header) => normalizeText(header));
  return values
    .slice(1)
    .map((row) =>
      headers.reduce((record, header, index) => {
        if (header) record[header] = row[index];
        return record;
      }, {}),
    )
    .filter((row) => Object.values(row).some((value) => normalizeText(value)));
}

function ensureStoreSheet(config) {
  const spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getSheetByName(config.name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(config.name);
    sheet.appendRow(config.headers);
    return sheet;
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(config.headers);
    return sheet;
  }

  const headers = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), config.headers.length))
    .getValues()[0]
    .map((header) => normalizeText(header));

  const missingHeaders = config.headers.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    sheet.getRange(1, headers.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
  }

  return sheet;
}

function appendObjectRow(sheet, object) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(normalizeText);
  sheet.appendRow(headers.map((header) => object[header] || ""));
}

function upsertRowByKey(sheet, key, value, object) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(normalizeText);
  const rows = readSheetRows(sheet);
  const index = rows.findIndex((row) => row[key] === value);
  const values = headers.map((header) => object[header] || "");

  if (index >= 0) {
    sheet.getRange(index + 2, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }
}

function deleteRowsWhere(sheet, predicate) {
  const rows = readSheetRows(sheet);
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (predicate(rows[index])) {
      sheet.deleteRow(index + 2);
    }
  }
}

function normalizePackageDetailsIfNeeded(row) {
  return normalizeContentRow(row);
}

function normalizePackageRow(row) {
  return {
    ...normalizeContentRow(row),
    details: normalizeText(row.details)
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

function normalizeContentRow(row) {
  return Object.entries(row).reduce((record, entry) => {
    const key = entry[0];
    const value = entry[1];
    const normalized = normalizeContentValue(key, value);
    if (normalized !== undefined) {
      record[key] = normalized;
    }
    return record;
  }, {});
}

function normalizeContentValue(key, value) {
  if (["id", "serviceId", "reactionCount", "recommendationCount", "sortOrder"].includes(key)) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : undefined;
  }

  const text = normalizeText(value);
  return text || undefined;
}

function parsePostPayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  return JSON.parse(e.postData.contents);
}

function assertAuthorized(apiKey) {
  const expectedKey = PropertiesService.getScriptProperties().getProperty(CONFIG.apiKeyProperty);
  if (!expectedKey) {
    throw new Error("Script property APPS_SCRIPT_API_KEY belum diisi.");
  }
  if (apiKey !== expectedKey) {
    throw new Error("Unauthorized");
  }
}

function requireText(value, message) {
  const text = normalizeText(value);
  if (!text) {
    throw new Error(message);
  }
  return text;
}

function normalizeText(value) {
  return String(value === null || value === undefined ? "" : value).trim();
}

function unique(values) {
  return Array.from(new Set(values.map(normalizeText).filter(Boolean)));
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
