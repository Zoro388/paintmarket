
"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import {
  QrCode,
  Download,
  Trash2,
  RefreshCw,
  ExternalLink,
  Printer,
} from "lucide-react";
import {
  apiCreateQRCode,
  apiGetQRCodes,
  apiDeleteQRCode,
} from "@/lib/userApi";

const WEBSITE_URL = "https://paintdomain.com/";

interface SavedQRCode {
  _id: string;
  title: string;
  url: string;
  createdAt: string;
}

export default function QRCodeGeneratorPage() {
  const [title, setTitle] = useState("Paint Domain Business Card");
  const [qrImage, setQrImage] = useState("");
  const [qrCodes, setQrCodes] = useState<SavedQRCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      const response = await apiGetQRCodes();
      setQrCodes(response.qrCodes || []);
    } catch (error: any) {
      toast.error(error.message || "Unable to load QR code history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQRCodes();
  }, []);

  const generateQRCode = async () => {
    if (!title.trim()) {
      toast.error("Please enter a QR code title.");
      return;
    }

    try {
      setSaving(true);

      const image = await QRCode.toDataURL(WEBSITE_URL, {
        width: 1200,
        margin: 4,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrImage(image);

      await apiCreateQRCode({
        title: title.trim(),
        url: WEBSITE_URL,
      });

      await loadQRCodes();
      toast.success("QR code generated and saved successfully.");
    } catch (error: any) {
      toast.error(error.message || "Unable to generate QR code.");
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async (item?: SavedQRCode) => {
    try {
      const url = item?.url || WEBSITE_URL;
      const image = await QRCode.toDataURL(url, {
        width: 1600,
        margin: 4,
        errorCorrectionLevel: "H",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [100, 120],
      });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.text(item?.title || title, 50, 15, {
        align: "center",
        maxWidth: 85,
      });

      pdf.addImage(image, "PNG", 15, 23, 70, 70);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Scan to visit Paint Domain", 50, 101, {
        align: "center",
      });

      pdf.setFontSize(8);
      pdf.text("https://paintdomain.com/", 50, 108, {
        align: "center",
      });

      const filename = (item?.title || title)
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase();

      pdf.save(`${filename}-qr-code.pdf`);
      toast.success("PDF downloaded successfully.");
    } catch {
      toast.error("Unable to download PDF.");
    }
  };

  const selectQRCode = async (item: SavedQRCode) => {
    try {
      const image = await QRCode.toDataURL(item.url, {
        width: 1200,
        margin: 4,
        errorCorrectionLevel: "H",
      });

      setQrImage(image);
      setTitle(item.title);
    } catch {
      toast.error("Unable to preview QR code.");
    }
  };

  const deleteQRCode = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this QR code?")) {
      return;
    }

    try {
      setDeleting(id);
      await apiDeleteQRCode(id);
      setQrCodes((previous) =>
        previous.filter((item) => item._id !== id)
      );
      toast.success("QR code deleted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Unable to delete QR code.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 text-white">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-accent/10 p-3 text-brand-accent">
            <QrCode size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">QR Code Generator</h1>
            <p className="text-sm text-grey-400">
              Generate and manage QR codes for Paint Domain.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-border bg-brand-raised p-6">
          <h2 className="mb-2 text-lg font-semibold">
            Create your QR code
          </h2>

          <p className="mb-6 text-sm text-grey-400">
            This QR code will direct customers to your website landing page.
          </p>

          <label className="mb-2 block text-sm font-medium">
            QR Code Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter QR code title"
            className="mb-4 w-full rounded-lg border border-brand-border bg-brand-black px-4 py-3 text-sm outline-none focus:border-brand-accent"
          />

          <label className="mb-2 block text-sm font-medium">
            Website URL
          </label>

          <div className="mb-6 flex items-center gap-2 rounded-lg border border-brand-border bg-brand-black px-4 py-3 text-sm text-grey-300">
            <ExternalLink size={16} className="text-brand-accent" />
            https://paintdomain.com/
          </div>

          <button
            onClick={generateQRCode}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-5 py-3 font-semibold text-brand-black transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <QrCode size={18} />
            )}
            {saving ? "Generating..." : "Generate & Save QR Code"}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-brand-raised p-6">
          <h2 className="mb-5 text-lg font-semibold">
            QR Code Preview
          </h2>

          {qrImage ? (
            <>
              <div className="rounded-xl bg-white p-4">
                <img
                  src={qrImage}
                  alt="Paint Domain QR Code"
                  className="h-64 w-64 object-contain"
                />
              </div>

              <p className="mt-4 text-center text-sm text-grey-400">
                Scan to visit Paint Domain
              </p>

              <button
                onClick={() => downloadPDF()}
                className="mt-5 flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-3 font-semibold text-brand-black hover:opacity-90"
              >
                <Download size={18} />
                Download Print PDF
              </button>
            </>
          ) : (
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border border-dashed border-brand-border text-grey-400">
              <QrCode size={65} className="mb-4 opacity-40" />
              <p className="text-sm">Your QR code will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-raised p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Saved QR Codes</h2>
            <p className="text-sm text-grey-400">
              Access and download your previously generated QR codes.
            </p>
          </div>

          <button
            onClick={loadQRCodes}
            disabled={loading}
            className="rounded-lg border border-brand-border p-2 text-grey-300 hover:text-white"
            title="Refresh history"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-grey-400">
            Loading saved QR codes...
          </p>
        ) : qrCodes.length === 0 ? (
          <div className="py-10 text-center text-grey-400">
            <QrCode size={40} className="mx-auto mb-3 opacity-40" />
            <p>No saved QR codes yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {qrCodes.map((item) => (
              <div
                key={item._id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-brand-border bg-brand-black p-4 sm:flex-row sm:items-center"
              >
                <button
                  onClick={() => selectQRCode(item)}
                  className="min-w-0 text-left"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 break-all text-sm text-grey-400">
                    {item.url}
                  </p>
                  <p className="mt-1 text-xs text-grey-500">
                    Created:{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </button>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => downloadPDF(item)}
                    title="Download PDF"
                    className="flex items-center gap-2 rounded-lg bg-brand-accent px-3 py-2 text-sm font-semibold text-brand-black hover:opacity-90"
                  >
                    <Printer size={16} />
                    PDF
                  </button>

                  <button
                    onClick={() => deleteQRCode(item._id)}
                    disabled={deleting === item._id}
                    title="Delete QR code"
                    className="rounded-lg border border-red-900/50 p-2 text-red-400 hover:bg-red-950/30 disabled:opacity-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
