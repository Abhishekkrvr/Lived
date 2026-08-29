"use client";

import { useEffect, useMemo, useState } from "react";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

const dateOf = (y, m, d) => new Date(y, m - 1, d);

const valid = (y, m, d) =>
  Number.isInteger(y) &&
  Number.isInteger(m) &&
  Number.isInteger(d) &&
  y > 0 &&
  m >= 1 &&
  m <= 12 &&
  d >= 1 &&
  d <= 31 &&
  (() => {
    const x = dateOf(y, m, d);
    return x.getFullYear() === y && x.getMonth() === m - 1 && x.getDate() === d;
  })();

function age(a, b) {
  let y = b.getFullYear() - a.getFullYear();
  let m = b.getMonth() - a.getMonth();
  let d = b.getDate() - a.getDate();

  if (d < 0) {
    d += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    m--;
  }

  if (m < 0) {
    m += 12;
    y--;
  }

  return { y, m, d };
}

function totals(a, b) {
  const s = Math.max(0, Math.floor((b - a) / 1000));

  return {
    seconds: s,
    minutes: Math.floor(s / 60),
    hours: Math.floor(s / 3600),
    days: Math.floor(s / 86400),
    weeks: Math.floor(s / 604800),
  };
}

function Fields({ value, setValue }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        ["d", "DD", 2],
        ["m", "MM", 2],
        ["y", "YYYY", 4],
      ].map(([key, ph, max]) => (
        <input
          key={key}
          inputMode="numeric"
          maxLength={max}
          placeholder={ph}
          value={value[key]}
          onChange={(e) =>
            setValue({
              ...value,
              [key]: e.target.value.replace(/\D/g, "").slice(0, max),
            })
          }
          className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-center outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100"
        />
      ))}
    </div>
  );
}

function Summary({ t, mode, name }) {
  const [heart, setHeart] = useState(Math.round(t.minutes * 70));

  useEffect(() => {
    if (mode !== "alive") return;

    const started = Date.now();
    const base = Math.round(t.minutes * 70);

    const id = setInterval(
      () => setHeart(base + Math.floor(((Date.now() - started) / 60000) * 70)),
      250,
    );

    return () => clearInterval(id);
  }, [mode, t.minutes]);

  const moons = Math.floor(t.days / 29.53);

  return (
    <section className="mt-8 rounded-[28px] bg-neutral-900 p-6 text-white sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-500">
        Life in numbers
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight">
        {mode === "alive"
          ? "So far, your life has included..."
          : `${name || "Their"} life included...`}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [t.days, "days"],
          [t.hours, "hours"],
          [t.minutes, "minutes"],
          [t.seconds, "seconds"],
        ].map(([n, l]) => (
          <div key={l} className="rounded-2xl bg-white/5 p-4">
            <b className="tabular text-lg">{fmt(n)}</b>
            <p className="mt-1 text-xs text-neutral-500">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 text-sm text-neutral-300 sm:grid-cols-2">
        <p>
          🌕 About <b className="text-white">{fmt(moons)}</b> full moons have
          passed.
        </p>

        <p>
          Estimated heartbeats:{" "}
          <b className="tabular text-white">{fmt(heart)}</b>
          {mode === "alive" && (
            <span className="ml-2 text-xs text-neutral-500">and counting</span>
          )}
        </p>
      </div>

      <p className="mt-5 rounded-2xl border border-white/10 px-4 py-3 text-[11px] leading-5 text-neutral-500">
        Heartbeat estimate assumes an average of 70 BPM. It is an illustrative
        estimate, not a health measurement.
      </p>
    </section>
  );
}

function Weeks({ weeks }) {
  const [expectancy, setExpectancy] = useState(80);

  const pct = Math.min(100, (weeks / (expectancy * 52.1775)) * 100);
  const shown = Math.min(weeks, 5200);

  return (
    <section className="mt-8 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-400">
            Life calendar
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight">
            Your life in weeks
          </h2>
        </div>

        <span className="text-xs text-neutral-400">
          {fmt(weeks)} weeks lived
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-neutral-500">
        Each dot represents one week you've already lived.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs text-neutral-500">Assumed lifespan:</span>

        {[70, 75, 80, 85].map((n) => (
          <button
            key={n}
            onClick={() => setExpectancy(n)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              expectancy === n
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-neutral-900 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-neutral-400">
        <span>
          {pct.toFixed(1)}% of {expectancy} assumed years
        </span>

        <span>Not a prediction</span>
      </div>

      <div className="mt-6 grid grid-cols-[repeat(26,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(52,minmax(0,1fr))] sm:gap-1.5">
        {Array.from({ length: shown }, (_, i) => (
          <span
            key={i}
            title={`Week ${i + 1}`}
            className="aspect-square rounded-full bg-neutral-900"
          />
        ))}
      </div>
    </section>
  );
}

function ShareCard({ data, t, a }) {
  return (
    <div
      id="share-card"
      style={{
        background:
          "radial-gradient(circle at 78% 12%,rgba(255,255,255,.13),transparent 24%),radial-gradient(circle at 15% 82%,rgba(255,255,255,.07),transparent 28%),#090909",
      }}
      className="absolute -left-[10000px] top-0 h-[1350px] w-[1080px] overflow-hidden p-[72px] text-white"
    >
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[44px] border border-white/10 bg-black/20 p-[62px]">
        <div className="absolute -right-28 -top-28 h-[360px] w-[360px] rounded-full border border-white/10" />
        <div className="absolute -right-16 -top-16 h-[240px] w-[240px] rounded-full border border-white/10" />

        <div className="relative flex items-center justify-between">
          <div className="text-[34px] font-black tracking-[-.04em]">LIVED.</div>

          <div className="rounded-full border border-white/15 px-5 py-2 text-[16px] font-semibold tracking-[.18em] text-white/50">
            {data.mode === "alive" ? "STILL COUNTING" : "REMEMBERED"}
          </div>
        </div>

        <div className="relative">
          <p className="text-[21px] font-semibold uppercase tracking-[.28em] text-white/40">
            {data.mode === "alive" ? "I HAVE LIVED" : "THEY LIVED"}
          </p>

          {data.name && (
            <p className="mt-5 text-[38px] font-bold text-white/80">
              {data.name}
            </p>
          )}

          <div className="mt-8 text-[174px] font-black leading-[.84] tracking-[-.085em]">
            {fmt(t.days)}
          </div>

          <p className="mt-6 text-[31px] font-medium uppercase tracking-[.28em] text-white/45">
            days
          </p>

          <div className="mt-14 grid grid-cols-3 gap-4">
            {[
              ["YEARS", a.y],
              ["MONTHS", a.m],
              ["DAYS", a.d],
            ].map(([l, n]) => (
              <div
                key={l}
                className="rounded-[24px] border border-white/10 bg-white/[.045] px-6 py-6"
              >
                <b className="text-[45px] font-black tabular">{fmt(n)}</b>

                <p className="mt-3 text-[14px] font-semibold tracking-[.2em] text-white/35">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-end justify-between">
          <p className="max-w-[600px] text-[25px] leading-tight text-white/55">
            {data.mode === "alive"
              ? "And I'm still counting."
              : "A life is more than a number."}
          </p>

          <div className="text-right">
            <div className="text-[15px] tracking-[.18em] text-white/30">
              EVERY SECOND COUNTS.
            </div>

            <div className="mt-2 text-[13px] text-white/20">lived.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Result({ data, onReset }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (data.mode !== "alive") return;

    const id = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(id);
  }, [data.mode]);

  const end = data.mode === "alive" ? now : data.end;

  const a = useMemo(() => age(data.start, end), [data.start, end]);

  const t = useMemo(() => totals(data.start, end), [data.start, end]);

  async function shareCard() {
    try {
      const W = 1080;
      const H = 1350;

      const canvas = document.createElement("canvas");

      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Canvas unavailable");

      const round = (x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      };

      const bg = ctx.createLinearGradient(0, 0, W, H);

      bg.addColorStop(0, "#0a0a0a");
      bg.addColorStop(1, "#171717");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,.055)";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(880, 185, 260, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(880, 185, 190, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(880, 185, 120, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,.03)";

      ctx.beginPath();
      ctx.arc(880, 185, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "900 38px Arial, sans-serif";
      ctx.fillText("LIVED.", 80, 100);

      ctx.fillStyle = "#777";
      ctx.font = "700 16px Arial, sans-serif";
      ctx.letterSpacing = "5px";

      ctx.fillText(
        data.mode === "alive" ? "I HAVE LIVED" : "THEY LIVED",
        80,
        165,
      );

      ctx.fillStyle = "#fff";
      ctx.font = "900 178px Arial, sans-serif";
      ctx.letterSpacing = "-7px";

      ctx.fillText(fmt(t.days), 80, 390);

      ctx.fillStyle = "#888";
      ctx.font = "700 28px Arial, sans-serif";
      ctx.letterSpacing = "6px";

      ctx.fillText("DAYS", 85, 438);

      const cards = [
        ["YEARS", a.y],
        ["MONTHS", a.m],
        ["DAYS", a.d],
      ];

      cards.forEach((it, i) => {
        const x = 80 + i * 310;

        round(x, 515, 280, 170, 24);

        ctx.fillStyle = "rgba(255,255,255,.055)";
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "900 55px Arial, sans-serif";
        ctx.letterSpacing = "0px";

        ctx.fillText(fmt(it[1]), x + 28, 595);

        ctx.fillStyle = "#777";
        ctx.font = "700 16px Arial, sans-serif";
        ctx.letterSpacing = "4px";

        ctx.fillText(it[0], x + 30, 640);
      });

      ctx.fillStyle = "#555";
      ctx.font = "700 15px Arial, sans-serif";
      ctx.letterSpacing = "3px";

      ctx.fillText("TIME THAT HAS ALREADY HAPPENED", 80, 770);

      const facts = [
        ["HOURS", t.hours],
        ["MINUTES", t.minutes],
        ["SECONDS", t.seconds],
      ];

      facts.forEach((it, i) => {
        const x = 80 + i * 310;

        ctx.fillStyle = "#ddd";
        ctx.font = "800 27px Arial, sans-serif";
        ctx.letterSpacing = "0px";

        ctx.fillText(fmt(it[1]), x, 825);

        ctx.fillStyle = "#666";
        ctx.font = "700 13px Arial, sans-serif";
        ctx.letterSpacing = "3px";

        ctx.fillText(it[0], x, 853);
      });

      ctx.strokeStyle = "rgba(255,255,255,.08)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(80, 925);
      ctx.lineTo(1000, 925);
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "700 30px Georgia, serif";
      ctx.letterSpacing = "0px";

      ctx.fillText(
        data.mode === "alive"
          ? "And I'm still counting."
          : "A life worth remembering.",
        80,
        1010,
      );

      if (data.mode === "passed" && data.name) {
        ctx.fillStyle = "#777";
        ctx.font = "500 20px Arial, sans-serif";

        ctx.fillText(data.name, 80, 1050);
      }

      ctx.fillStyle = "#666";
      ctx.font = "600 16px Arial, sans-serif";
      ctx.letterSpacing = "4px";

      ctx.fillText("EVERY SECOND COUNTS.", 80, 1240);

      ctx.fillStyle = "#444";
      ctx.font = "600 14px Arial, sans-serif";
      ctx.letterSpacing = "2px";

      ctx.fillText("LIVED. · LIFE IN NUMBERS", 80, 1285);

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Image creation failed");

        const file = new File([blob], "lived-result.png", {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              title: "LIVED.",
              text: "Every second counts.",
              files: [file],
            });

            return;
          } catch {}
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "lived-result.png";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    } catch (err) {
      console.error("Share card error:", err);
      alert("We couldn't create the share card. Please try again.");
    }
  }

  return (
    <main className="min-h-screen px-5 py-8">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <button onClick={onReset} className="text-xl font-black tracking-tight">
          LIVED.
        </button>

        <span className="text-[10px] uppercase tracking-[.2em] text-neutral-400">
          Your life in numbers
        </span>
      </header>

      <section className="mx-auto mt-12 max-w-4xl animate-[fade_.4s_ease]">
        <div className="rounded-[30px] border border-neutral-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(0,0,0,.06)] sm:p-12">
          <p className="text-[11px] font-bold uppercase tracking-[.22em] text-neutral-400">
            {data.mode === "alive"
              ? "You have lived"
              : data.name || "Their life"}
          </p>

          <div className="mt-3 text-6xl font-black tracking-[-.07em] sm:text-8xl tabular">
            {fmt(t.days)}
          </div>

          <p className="text-neutral-500">days</p>

          {data.mode === "alive" && (
            <div className="mt-5 inline-flex rounded-full bg-neutral-100 px-4 py-2 text-xs text-neutral-500">
              <span className="mr-2 animate-[pulseSoft_1s_infinite]">●</span>
              Live counter · updating every second
            </div>
          )}

          <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-4">
            {[
              ["Years", a.y],
              ["Months", a.m],
              ["Days", a.d],
            ].map(([l, n]) => (
              <div key={l} className="rounded-2xl bg-neutral-50 p-4 sm:p-6">
                <b className="text-2xl sm:text-3xl">{fmt(n)}</b>

                <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400">
                  {l}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-6 sm:grid-cols-4">
            {[
              ["Weeks", t.weeks],
              ["Hours", t.hours],
              ["Minutes", t.minutes],
              ["Seconds", t.seconds],
            ].map(([l, n]) => (
              <div key={l}>
                <b className="tabular">{fmt(n)}</b>

                <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400">
                  {l}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3">
            <button
              onClick={shareCard}
              className="h-12 whitespace-nowrap rounded-xl bg-neutral-900 px-2 text-sm font-bold text-white hover:bg-neutral-700"
            >
              Create share card
            </button>

            <button
              onClick={onReset}
              className="h-12 whitespace-nowrap rounded-xl border border-neutral-200 bg-white px-2 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
            >
              Calculate again
            </button>
          </div>
        </div>

        <Summary t={t} mode={data.mode} name={data.name} />

        {data.mode === "alive" && <Weeks weeks={t.weeks} />}

        {/* Meaning section */}
        <div className="mt-8 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-400">
            What does this mean?
          </p>

          <p className="mt-3 text-lg leading-8 text-neutral-700">
            {data.mode === "alive" ? (
              <>
                You've already lived <b>{fmt(t.days)} days</b>, experienced
                thousands of mornings and nights, and watched the world change
                for {fmt(t.hours)} hours. The number keeps moving because your
                story does too.
              </>
            ) : (
              <>
                They lived <b>{fmt(t.days)} days</b>, experienced thousands of
                mornings and nights, and watched the world change for{" "}
                {fmt(t.hours)} hours. Their story may have ended, but the time
                they lived remains.
              </>
            )}
          </p>
        </div>

        <ShareCard data={data} t={t} a={a} />

        <p className="py-10 text-center text-sm italic text-neutral-400">
          Every second counts.
        </p>
      </section>
    </main>
  );
}

export default function Home() {
  const [mode, setMode] = useState("alive");
  const [birth, setBirth] = useState({
    d: "",
    m: "",
    y: "",
  });
  const [death, setDeath] = useState({
    d: "",
    m: "",
    y: "",
  });
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const today = new Date();

  function calc() {
    setError("");

    if (!valid(+birth.y, +birth.m, +birth.d)) {
      setError("Please enter a valid date of birth.");
      return;
    }

    const b = dateOf(+birth.y, +birth.m, +birth.d);

    if (b > today) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    let end = today;

    if (mode === "passed") {
      if (!valid(+death.y, +death.m, +death.d)) {
        setError("Please enter a valid date of death.");
        return;
      }

      end = dateOf(+death.y, +death.m, +death.d);

      if (end <= b || end > today) {
        setError(
          "Date of death must be after birth and cannot be in the future.",
        );
        return;
      }
    }

    setResult({
      start: b,
      end,
      mode,
      name,
    });
  }

  if (result) {
    return <Result data={result} onReset={() => setResult(null)} />;
  }

  return (
    <main className="min-h-screen px-5 py-8">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="text-xl font-black tracking-tight">LIVED.</div>

        <span className="text-[10px] uppercase tracking-[.2em] text-neutral-400">
          Your life in numbers
        </span>
      </header>

      <section className="mx-auto max-w-5xl pb-20 pt-15 text-center sm:pt-20">
        <div className="mx-auto w-fit text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
          A simple reminder
        </div>

        <h1 className="mx-auto mt-5 max-w-6xl text-5xl font-black leading-[0.82] tracking-[-0.065em] sm:text-7xl md:text-8xl">
          <span className="block whitespace-nowrap">
            You've{" "}
            <span className="relative inline-block text-green-500">
              lived
              <span className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-green-500/20 sm:-bottom-3 sm:h-1.5" />
            </span>{" "}
            more
          </span>

          <span className="mt-3 block whitespace-nowrap sm:mt-4">
            than you think.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-neutral-500 sm:text-lg">
          A simple calculation that makes time feel real.
        </p>

        <div className="mx-auto mt-6 max-w-xl rounded-[28px] border border-neutral-200 bg-white p-5 text-left shadow-[0_20px_60px_rgba(0,0,0,.05)] sm:p-7">
          <div className="grid grid-cols-2 rounded-xl bg-neutral-100 p-1">
            <button
              onClick={() => {
                setMode("alive");
                setError("");
              }}
              className={`h-11 rounded-lg text-sm font-bold ${
                mode === "alive" ? "bg-white shadow-sm" : "text-neutral-500"
              }`}
            >
              I'm Alive
            </button>

            <button
              onClick={() => {
                setMode("passed");
                setError("");
              }}
              className={`h-11 rounded-lg text-sm font-bold ${
                mode === "passed" ? "bg-white shadow-sm" : "text-neutral-500"
              }`}
            >
              Remember Someone
            </button>
          </div>

          <div className="mt-7 space-y-6">
            {mode === "passed" && (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[.16em] text-neutral-500">
                  Name{" "}
                  <span className="font-normal normal-case tracking-normal text-neutral-400">
                    (optional)
                  </span>
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Their name"
                  className="h-12 w-full rounded-xl border border-neutral-200 px-4 outline-none focus:border-neutral-900"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[.16em] text-neutral-500">
                Date of birth
              </label>

              <Fields value={birth} setValue={setBirth} />

              <p className="mt-2 text-[11px] text-neutral-400">
                DD / MM / YYYY
              </p>
            </div>

            {mode === "passed" && (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[.16em] text-neutral-500">
                  Date of death
                </label>

                <Fields value={death} setValue={setDeath} />

                <p className="mt-2 text-[11px] text-neutral-400">
                  DD / MM / YYYY
                </p>
              </div>
            )}

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={calc}
              className="h-13 w-full rounded-xl bg-neutral-900 font-bold text-white hover:bg-neutral-700 active:scale-[.99]"
            >
              {mode === "alive" ? "Count My Life" : "Calculate Their Life"}
            </button>

            <p className="text-center text-[11px] text-neutral-400">
              No account. Your dates stay in your browser.
            </p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
        LIVED. · Every second counts.
      </footer>
    </main>
  );
}
