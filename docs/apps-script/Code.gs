var SHEETS = {
  LANDING_HERO: "landing_hero",
  LANDING_CONSULTATION: "landing_consultation",
  LANDING_SERVICES: "landing_services",
  LANDING_PROMOS: "landing_promos",
  LANDING_PACKAGES: "landing_packages",
  LANDING_TESTIMONIALS: "landing_testimonials",
  LANDING_FEATURED_TREATMENTS: "landing_featured_treatments",
  SERVICE_LIST: "service_list",
  ABOUT_PAGE: "about_page",
  ABOUT_VALUES: "about_values",
  ABOUT_LOCATIONS: "about_locations",
  HELP_PAGE: "help_page",
  HELP_TOPICS: "help_topics",
  MEMBER_SUMMARY: "member_summary",
  MEMBER_MENUS: "member_menus",
};

function doGet(e) {
  var action = getParam_(e, "action");

  if (action === "getMemberSummary") {
    return jsonOutput_(getMemberSummary_(e));
  }

  return jsonOutput_(buildSitePayload_());
}

function doPost(e) {
  try {
    var body = parseJsonBody_(e);
    var action = body.action || "";

    if (action === "upsertMember") {
      return jsonOutput_(upsertMember_(body));
    }

    if (action === "updateMemberName") {
      return jsonOutput_(updateMemberName_(body));
    }

    return jsonOutput_({
      ok: false,
      message: "Unsupported action",
    });
  } catch (error) {
    return jsonOutput_({
      ok: false,
      message: error.message || "Unknown error",
    });
  }
}

function buildSitePayload_() {
  return {
    hero: firstRowObject_(SHEETS.LANDING_HERO),
    consultation: firstRowObject_(SHEETS.LANDING_CONSULTATION),
    services: sortedRows_(SHEETS.LANDING_SERVICES).map(function (row) {
      return {
        id: row.id,
        label: row.label,
        iconUrl: row.iconUrl || "",
      };
    }),
    promos: sortedRows_(SHEETS.LANDING_PROMOS).map(function (row) {
      return {
        id: row.id,
        title: row.title || "",
        imageUrl: row.imageUrl || "",
        link: row.link || "",
      };
    }),
    packages: sortedRows_(SHEETS.LANDING_PACKAGES).map(function (row) {
      return {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle || "",
        details: splitPipe_(row.details),
        duration: row.duration || "",
        imageUrl: row.imageUrl || "",
      };
    }),
    testimonials: sortedRows_(SHEETS.LANDING_TESTIMONIALS).map(function (row) {
      return {
        id: row.id,
        author: row.author,
        timeAgo: row.timeAgo,
        category: row.category,
        title: row.title,
        message: row.message,
        reactionCount: toNumber_(row.reactionCount),
        ctaLabel: row.ctaLabel || "Bantu Mom lain",
      };
    }),
    featuredTreatments: sortedRows_(SHEETS.LANDING_FEATURED_TREATMENTS).map(function (row) {
      return {
        id: row.id,
        name: row.name,
        description: row.description || "",
        imageUrl: row.imageUrl || "",
      };
    }),
    serviceList: sortedRows_(SHEETS.SERVICE_LIST).map(function (row) {
      return {
        id: row.id,
        title: row.title,
        description: row.description || "",
        duration: row.duration || "",
        imageUrl: row.imageUrl || "",
      };
    }),
    about: {
      heroTitle: firstValue_(SHEETS.ABOUT_PAGE, "heroTitle"),
      heroDescription: firstValue_(SHEETS.ABOUT_PAGE, "heroDescription"),
      values: sortedRows_(SHEETS.ABOUT_VALUES).map(function (row) {
        return {
          title: row.title,
          description: row.description || "",
        };
      }),
      locations: sortedRows_(SHEETS.ABOUT_LOCATIONS).map(function (row) {
        return {
          id: row.id,
          name: row.name,
          address: row.address || "",
          mapUrl: row.mapUrl || "",
        };
      }),
    },
    help: {
      heroTitle: firstValue_(SHEETS.HELP_PAGE, "heroTitle"),
      heroDescription: firstValue_(SHEETS.HELP_PAGE, "heroDescription"),
      contactTitle: firstValue_(SHEETS.HELP_PAGE, "contactTitle"),
      contactDescription: firstValue_(SHEETS.HELP_PAGE, "contactDescription"),
      contactButtonLabel: firstValue_(SHEETS.HELP_PAGE, "contactButtonLabel"),
      whatsappNumber: firstValue_(SHEETS.HELP_PAGE, "whatsappNumber"),
      topics: sortedRows_(SHEETS.HELP_TOPICS).map(function (row) {
        return {
          id: row.id,
          title: row.title,
          description: row.description || "",
        };
      }),
    },
  };
}

function getMemberSummary_(e) {
  var userId = getParam_(e, "userId");
  var email = normalizeText_(getParam_(e, "email"));
  var rows = getSheetObjects_(SHEETS.MEMBER_SUMMARY);
  var menus = sortedRows_(SHEETS.MEMBER_MENUS).map(function (row) {
    return {
      key: row.key,
      label: row.label,
      href: row.href,
    };
  });

  var match = rows.find(function (row) {
    var byUserId = userId && row.userId === userId;
    var byEmail = email && normalizeText_(row.email) === email;
    return byUserId || byEmail;
  });

  return {
    summary: {
      memberLevel: (match && match.memberLevel) || "-",
      points: toNumber_(match && match.points),
    },
    menus: menus,
  };
}

function upsertMember_(payload) {
  var sheet = getOrCreateSheet_(SHEETS.MEMBER_SUMMARY, [
    "userId",
    "email",
    "name",
    "memberLevel",
    "points",
    "image",
    "lastLoginAt",
  ]);
  var rows = getSheetObjects_(SHEETS.MEMBER_SUMMARY);
  var normalizedEmail = normalizeText_(payload.email);
  var rowIndex = -1;

  for (var i = 0; i < rows.length; i += 1) {
    var row = rows[i];
    var matchByUserId = payload.userId && row.userId === payload.userId;
    var matchByEmail = normalizedEmail && normalizeText_(row.email) === normalizedEmail;
    if (matchByUserId || matchByEmail) {
      rowIndex = i + 2;
      break;
    }
  }

  var values = [
    payload.userId || "",
    payload.email || "",
    payload.name || "",
    payload.memberLevel || "-",
    payload.points || 0,
    payload.image || "",
    payload.lastLoginAt || new Date().toISOString(),
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }

  return {
    ok: true,
    message: "Member synced",
  };
}

function updateMemberName_(payload) {
  var sheet = getOrCreateSheet_(SHEETS.MEMBER_SUMMARY, [
    "userId",
    "email",
    "name",
    "memberLevel",
    "points",
    "image",
    "lastLoginAt",
  ]);
  var rows = getSheetObjects_(SHEETS.MEMBER_SUMMARY);
  var normalizedEmail = normalizeText_(payload.email);

  for (var i = 0; i < rows.length; i += 1) {
    var row = rows[i];
    var matchByUserId = payload.userId && row.userId === payload.userId;
    var matchByEmail = normalizedEmail && normalizeText_(row.email) === normalizedEmail;

    if (matchByUserId || matchByEmail) {
      sheet.getRange(i + 2, 3).setValue(payload.name || row.name || "");
      return {
        ok: true,
        message: "Username updated",
      };
    }
  }

  sheet.appendRow([
    payload.userId || "",
    payload.email || "",
    payload.name || "",
    "-",
    0,
    "",
    payload.updatedAt || new Date().toISOString(),
  ]);

  return {
    ok: true,
    message: "Username created",
  };
}

function getSheetObjects_(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];

  var values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) return [];

  var headers = values[0].map(function (header) {
    return String(header).trim();
  });

  return values.slice(1).filter(function (row) {
    return row.some(function (cell) {
      return String(cell).trim() !== "";
    });
  }).map(function (row) {
    var obj = {};
    headers.forEach(function (header, index) {
      obj[header] = row[index];
    });
    return obj;
  });
}

function sortedRows_(sheetName) {
  return getSheetObjects_(sheetName).sort(function (a, b) {
    return toNumber_(a.sortOrder) - toNumber_(b.sortOrder);
  });
}

function firstRowObject_(sheetName) {
  var rows = getSheetObjects_(sheetName);
  return rows[0] || {};
}

function firstValue_(sheetName, key) {
  var row = firstRowObject_(sheetName);
  return row[key] || "";
}

function getOrCreateSheet_(sheetName, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (sheet) return sheet;

  sheet = ss.insertSheet(sheetName);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sheet;
}

function parseJsonBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  return JSON.parse(e.postData.contents);
}

function splitPipe_(value) {
  return String(value || "")
    .split("|")
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean);
}

function toNumber_(value) {
  var num = Number(value);
  return isNaN(num) ? 0 : num;
}

function getParam_(e, key) {
  if (!e || !e.parameter) return "";
  return e.parameter[key] || "";
}

function normalizeText_(value) {
  return String(value || "").trim().toLowerCase();
}

function jsonOutput_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
