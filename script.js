document.addEventListener("DOMContentLoaded", () => {
  /* ========== NAV TOGGLE (MOBILE) ========== */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("nav-open");
    });
  }

  /* ========== STATS (MANUAL CONFIG) ========== */
  const statsConfig = {
    totalMembers: 50,   // EDIT HERE
    verified: 10,       // EDIT HERE
    advanced: 3,        // EDIT HERE
    giveaways: 160,     // EDIT HERE
    payout: 10569       // EDIT HERE (₹)
  };

  function animateStat(id, value, duration = 800) {
    const el = document.getElementById(id);
    if (!el) return;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * value);
      el.textContent = current.toLocaleString("en-IN");
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  animateStat("stat-total-members", statsConfig.totalMembers);
  animateStat("stat-verified", statsConfig.verified);
  animateStat("stat-advanced", statsConfig.advanced);
  animateStat("stat-giveaways", statsConfig.giveaways);
  animateStat("stat-payout", statsConfig.payout);

  /* ========== VERIFICATION FORM HELPER ========== */
  const verifyForm = document.getElementById("verify-form");
  const verifyPreview = document.getElementById("verify-preview");
  const verifyPreviewText = document.getElementById("verify-preview-text");
  const verifyPreviewStatus = document.getElementById("verify-preview-status");
  const verifyCopyBtn = document.getElementById("verify-copy-btn");

  if (verifyForm && verifyPreview && verifyPreviewText && verifyPreviewStatus) {
    verifyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("vf-name").value.trim();
      const username = document.getElementById("vf-username").value.trim();
      const state = document.getElementById("vf-state").value.trim();
      const age = document.getElementById("vf-age").value.trim();
      const upi = document.getElementById("vf-upi").value.trim();
      const level = document.getElementById("vf-level").value;
      const aadhaar = document.getElementById("vf-aadhaar").value.trim();
      const vipPayment = document
        .getElementById("vf-vip-payment")
        .value.trim();
      const notes = document.getElementById("vf-notes").value.trim();

      let message = `TrueWin Verification Request\n\n`;
      message += `Name: ${name}\n`;
      message += `Telegram Username: ${username}\n`;
      message += `State: ${state}\n`;
      message += `Age: ${age}\n`;
      message += `UPI ID: ${upi}\n`;
      message += `Requested Level: ${
        level === "advanced" ? "Advanced Verified (VIP)" : "Verified (Public)"
      }\n`;

      if (level === "advanced") {
        message += `Aadhaar Last 4 Digits: ${
          aadhaar || "Will provide as instructed"
        }\n`;
        message += `VIP Payment Info: ${
          vipPayment || "Will pay ₹149 now via UPI / Razorpay"
        }\n`;
      }

      if (notes) {
        message += `Extra Note: ${notes}\n`;
      }

      message += `\nI confirm I am 18+ and understand that TrueWin giveaways are skill-based and not gambling.`;

      verifyPreviewText.value = message;
      verifyPreview.classList.remove("hidden");
      verifyPreviewStatus.textContent =
        "Copied format ready. Now open Telegram → DM @truewindigitalservices → paste this message and send.";
    });

    if (verifyCopyBtn) {
      verifyCopyBtn.addEventListener("click", async () => {
        if (!verifyPreviewText.value) return;
        try {
          await navigator.clipboard.writeText(verifyPreviewText.value);
          verifyPreviewStatus.textContent = "Copied to clipboard ✅";
        } catch (err) {
          verifyPreviewStatus.textContent =
            "Could not auto-copy. Please long-press and copy manually.";
        }
      });
    }
  }

  /* ========== GAME TABS ========== */
  const gameTabs = document.querySelectorAll(".game-tab");
  const gamePanels = document.querySelectorAll(".game-panel");

  function showGamePanel(gameId) {
    gameTabs.forEach((tab) => {
      if (tab.dataset.game === gameId) tab.classList.add("active");
      else tab.classList.remove("active");
    });
    gamePanels.forEach((panel) => {
      if (panel.id === `game-${gameId}`) panel.classList.add("active");
      else panel.classList.remove("active");
    });
  }

  gameTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const gameId = tab.dataset.game;
      showGamePanel(gameId);
    });
  });

  /* ========== KNIFE HIT ARENA ========== */
  const knifeCanvas = document.getElementById("knife-canvas");
  const knifeStatus = document.getElementById("knife-status");
  const knifeResetBtn = document.getElementById("knife-reset");
  let knifeAnimationId;

  if (knifeCanvas && knifeStatus && knifeResetBtn) {
    const kCtx = knifeCanvas.getContext("2d");
    const cx = knifeCanvas.width / 2;
    const cy = knifeCanvas.height / 2;
    const radius = 90;
    const knifeLength = 35;
    const collisionThreshold = 18; // degrees
    const targetKnives = 10;

    let rotationAngle = 0;
    let rotationSpeed = 0.7; // deg per frame
    let knives = []; // angles in degrees
    let running = true;
    let win = false;

    function resetKnifeGame() {
      rotationAngle = 0;
      knives = [];
      running = true;
      win = false;
      knifeStatus.textContent =
        "Tap/click inside the arena to throw knives. Place all 10 without collision.";
      if (knifeAnimationId) cancelAnimationFrame(knifeAnimationId);
      updateKnifeGame();
    }

    function drawKnifeGame() {
      kCtx.clearRect(0, 0, knifeCanvas.width, knifeCanvas.height);

      // Background glow
      const gradBg = kCtx.createRadialGradient(
        cx,
        cy,
        40,
        cx,
        cy,
        radius + 80
      );
      gradBg.addColorStop(0, "#020617");
      gradBg.addColorStop(1, "#000000");
      kCtx.fillStyle = gradBg;
      kCtx.fillRect(0, 0, knifeCanvas.width, knifeCanvas.height);

      // Spinning circle
      const gradCircle = kCtx.createRadialGradient(
        cx - 20,
        cy - 20,
        30,
        cx,
        cy,
        radius + 10
      );
      gradCircle.addColorStop(0, "#22d3ee");
      gradCircle.addColorStop(0.4, "#0ea5e9");
      gradCircle.addColorStop(1, "#1e293b");

      kCtx.beginPath();
      kCtx.arc(cx, cy, radius, 0, Math.PI * 2);
      kCtx.fillStyle = gradCircle;
      kCtx.fill();
      kCtx.lineWidth = 3;
      kCtx.strokeStyle = "rgba(148, 163, 184, 0.8)";
      kCtx.stroke();

      // Stuck knives
      kCtx.save();
      kCtx.translate(cx, cy);
      kCtx.rotate((rotationAngle * Math.PI) / 180);

      knives.forEach((angleDeg) => {
        kCtx.save();
        kCtx.rotate((angleDeg * Math.PI) / 180);
        kCtx.translate(0, -(radius + 5));

        kCtx.beginPath();
        kCtx.moveTo(-2, 0);
        kCtx.lineTo(2, 0);
        kCtx.lineTo(0, knifeLength);
        kCtx.closePath();
        kCtx.fillStyle = "#f97316";
        kCtx.shadowColor = "#fb923c";
        kCtx.shadowBlur = 10;
        kCtx.fill();

        kCtx.restore();
      });

      kCtx.restore();

      // Center text
      kCtx.fillStyle = "#e5e7eb";
      kCtx.font =
        "14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      kCtx.textAlign = "center";
      kCtx.fillText(
        `${targetKnives - knives.length} left`,
        cx,
        cy + 4
      );
    }

    function updateKnifeGame() {
      if (!running) {
        drawKnifeGame();
        return;
      }
      rotationAngle = (rotationAngle + rotationSpeed) % 360;
      drawKnifeGame();
      knifeAnimationId = requestAnimationFrame(updateKnifeGame);
    }

    function checkCollision(newAngle) {
      for (const a of knives) {
        let diff = Math.abs(a - newAngle);
        if (diff > 180) diff = 360 - diff;
        if (diff < collisionThreshold) return true;
      }
      return false;
    }

    function handleKnifeThrow() {
      if (!running || win) return;

      // Absolute angle where knife will be placed (relative to circle)
      const absAngle = (-rotationAngle + 360) % 360;

      if (checkCollision(absAngle)) {
        running = false;
        win = false;
        knifeStatus.textContent =
          "❌ Knife hit another knife! Game over. Tap Restart to try again.";
        return;
      }

      knives.push(absAngle);

      if (knives.length >= targetKnives) {
        running = false;
        win = true;
        knifeStatus.textContent =
          "✅ Perfect! You placed all knives without collision.";
      } else {
        knifeStatus.textContent = `Nice! ${
          targetKnives - knives.length
        } knives left.`;
      }
    }

    knifeCanvas.addEventListener("click", handleKnifeThrow);
    knifeCanvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleKnifeThrow();
    });

    knifeResetBtn.addEventListener("click", resetKnifeGame);

    // Start once
    resetKnifeGame();
  }

  /* ========== NEON DODGE RUNNER ========== */
  const dodgeCanvas = document.getElementById("dodge-canvas");
  const dodgeStatus = document.getElementById("dodge-status");
  const dodgeStartBtn = document.getElementById("dodge-start");
  let dodgeAnimationId;

  if (dodgeCanvas && dodgeStatus && dodgeStartBtn) {
    const dCtx = dodgeCanvas.getContext("2d");
    const width = dodgeCanvas.width;
    const height = dodgeCanvas.height;

    const playerWidth = 40;
    const playerHeight = 12;
    let playerX = width / 2 - playerWidth / 2;
    const playerY = height - 40;
    let moveLeft = false;
    let moveRight = false;
    const playerSpeed = 4;

    let blocks = [];
    let blockTimer = 0;
    let blockInterval = 55; // frames
    let gameRunning = false;
    let score = 0;

    function resetDodgeGame() {
      blocks = [];
      blockTimer = 0;
      blockInterval = 55;
      gameRunning = true;
      score = 0;
      playerX = width / 2 - playerWidth / 2;
      dodgeStatus.textContent =
        "Use ← / → keys (or A / D) to move. Dodge the neon blocks!";
      if (dodgeAnimationId) cancelAnimationFrame(dodgeAnimationId);
      updateDodgeGame();
    }

    function spawnBlock() {
      const blockWidth = 40 + Math.random() * 40;
      const x = Math.random() * (width - blockWidth);
      const speed = 2 + Math.random() * 2;
      blocks.push({ x, y: -20, width: blockWidth, height: 14, speed });
    }

    function drawDodgeGame() {
      dCtx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGrad = dCtx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#020617");
      bgGrad.addColorStop(1, "#020617");
      dCtx.fillStyle = bgGrad;
      dCtx.fillRect(0, 0, width, height);

      // Player
      const playerGrad = dCtx.createLinearGradient(
        playerX,
        playerY,
        playerX + playerWidth,
        playerY
      );
      playerGrad.addColorStop(0, "#22c55e");
      playerGrad.addColorStop(1, "#a3e635");
      dCtx.fillStyle = playerGrad;
      dCtx.shadowColor = "#22c55e";
      dCtx.shadowBlur = 12;
      dCtx.fillRect(playerX, playerY, playerWidth, playerHeight);

      // Blocks
      blocks.forEach((b) => {
        const blockGrad = dCtx.createLinearGradient(b.x, b.y, b.x + b.width, b.y);
        blockGrad.addColorStop(0, "#f97316");
        blockGrad.addColorStop(1, "#ef4444");
        dCtx.fillStyle = blockGrad;
        dCtx.shadowColor = "#f97316";
        dCtx.shadowBlur = 10;
        dCtx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Score
      dCtx.shadowBlur = 0;
      dCtx.fillStyle = "#e5e7eb";
      dCtx.font =
        "13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      dCtx.textAlign = "left";
      dCtx.fillText(`Score: ${score}`, 8, 16);
    }

    function updateDodgeGame() {
      if (!gameRunning) {
        drawDodgeGame();
        return;
      }

      // Move player
      if (moveLeft) {
        playerX -= playerSpeed;
      } else if (moveRight) {
        playerX += playerSpeed;
      }
      playerX = Math.max(4, Math.min(width - playerWidth - 4, playerX));

      // Spawn blocks
      blockTimer++;
      if (blockTimer >= blockInterval) {
        blockTimer = 0;
        spawnBlock();
        if (blockInterval > 25) blockInterval -= 0.8; // increase difficulty
      }

      // Move blocks
      blocks.forEach((b) => {
        b.y += b.speed;
      });

      // Remove off-screen blocks & increase score
      blocks = blocks.filter((b) => {
        if (b.y > height + 30) {
          score++;
          return false;
        }
        return true;
      });

      // Collision
      for (const b of blocks) {
        const overlapX =
          playerX < b.x + b.width && playerX + playerWidth > b.x;
        const overlapY =
          playerY < b.y + b.height && playerY + playerHeight > b.y;
        if (overlapX && overlapY) {
          gameRunning = false;
          dodgeStatus.textContent = `💥 Hit! Final score: ${score}. Press Start / Restart to play again.`;
          drawDodgeGame();
          return;
        }
      }

      drawDodgeGame();
      dodgeAnimationId = requestAnimationFrame(updateDodgeGame);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        moveLeft = true;
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        moveRight = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        moveLeft = false;
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        moveRight = false;
      }
    });

    dodgeStartBtn.addEventListener("click", resetDodgeGame);

    // Initial static draw
    drawDodgeGame();
    dodgeStatus.textContent =
      "Press Start / Restart, then use ← / → or A / D to move.";
  }
});
