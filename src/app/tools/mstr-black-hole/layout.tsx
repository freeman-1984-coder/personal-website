import "./mstr.css";

export const metadata = {
  title: "MSTR Bitcoin Black Hole | Crazy Lax",
  description: "Visualizing the singularity. MicroStrategy's Bitcoin holdings.",
};

export default function MstrBlackHoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide the global navbar and override body background cleanly */}
      <style>{`
        .navbar { display: none !important; }
        body { background-image: none !important; background-color: black !important; }
        main { padding-top: 0 !important; padding-bottom: 0 !important; min-height: 100vh !important; }
      `}</style>
      <div className="mstr-black-hole-wrapper">
        {children}
      </div>
    </>
  );
}
