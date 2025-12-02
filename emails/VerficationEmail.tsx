interface OtpEmailProps {
    username?: string;
    otp: string;
  }
  
  export default function VerificationEmail({
    username = "there",
    otp
  }: OtpEmailProps) {
    return (
      <div
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          padding: "20px",
          backgroundColor: "#f7f7f7",
          color: "#333",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 600,
              marginBottom: "12px",
              color: "#111",
            }}
          >
            Your Verification Code 🔐
          </h2>
  
          <p style={{ fontSize: "15px", marginBottom: "16px" }}>
            Hi {username},  
            <br />
            Use the OTP below to verify your email for{" "}
            <strong>Echoes</strong>.
          </p>
  
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "6px",
              textAlign: "center",
              padding: "14px 0",
              background: "#f3f4f6",
              borderRadius: "10px",
              color: "#111",
              marginBottom: "20px",
            }}
          >
            {otp}
          </div>
  
          <p style={{ fontSize: "14px", color: "#555" }}>
            This OTP is valid for the next <strong>10 minutes</strong>.  
            Please do not share it with anyone.
          </p>
  
          <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
  
          <p
            style={{
              fontSize: "12px",
              color: "#777",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            © {new Date().getFullYear()} Echoes. All rights reserved.
          </p>
        </div>
      </div>
    );
  }
  