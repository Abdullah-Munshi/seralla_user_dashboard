const db = require("../config/db");
exports.startKyc = async (req, res) => {
  const token = btoa(
    `${process.env.SHUFTI_CLIENT_ID}:${process.env.SHUFTI_SECRET_KEY}`
  );

  const payload = {
    reference: `SP_${Math.floor(Math.random() * 900) + 1000}_${
      req.user.userId
    }`,
    callback_url: "https://serrala.globalsimguide.com/api/v1/kyc/status",
    redirect_url: "https://serrala.globalsimguide.com/",
    document: {
      supported_types: ["id_card", "driving_license", "passport"],
      allow_offline: "1",
      allow_online: "1",
      fetch_enhanced_data: "1",
      verification_mode: "any",
      show_ocr_form: "1",
    },
  };

  try {
    const response = await fetch("https://api.shuftipro.com/", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + token, // if access token then replace "Basic" with "Bearer"
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(200).json({
      success: true,
      data: data,
      message: "KYC request initiated.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "KYC_FAILED",
        message: "KYC request failed!",
      },
    });
  }
};

exports.kycCallback = async (req, res) => {
  const result = req.body;
  const userId = parseInt(result.reference.split("_")[2]);

  if (result.event === "verification.accepted") {
    await db.query("UPDATE users SET kyc_status = ? WHERE id = ?", [1, userId]);
    res.status(200).json({
      success: true,
      message: "User Verified!",
    });
  } else {
    res.status(401).json({
      success: false,
      error: {
        code: "VERIFICATION_FAILED",
        message: "User not verified!",
      },
    });
  }
};
