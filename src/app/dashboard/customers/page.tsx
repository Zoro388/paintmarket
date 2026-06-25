"use client";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  apiSendCampaign,
  // apiSendUserMessage,
  adminGetSubscribers,
} from "@/lib/adminApi";
import { Send, Users, User, X, Loader, Mail, Link2, Type, AlignLeft } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

const inputCls =
  "w-full bg-brand-raised border border-brand-mid/40 text-white placeholder-brand-mid px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

const EMPTY_FORM = { title: "", message: "", buttonText: "", buttonLink: "" };

export default function NewsletterCampaignPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [mode, setMode] = useState<"all" | "single">("all");
  const [selectedUser, setSelectedUser] = useState<Subscriber | null>(null);
  const [userPickerOpen, setUserPickerOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  // Fetch subscribers for single-user picker
  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const res = (await adminGetSubscribers()) as {
        subscribers?: Subscriber[] | boolean;
        count?: number;
      };
      const list: Subscriber[] = Array.isArray(res?.subscribers) ? res.subscribers : [];
      return list;
    },
  });

  const subscribers = subData ?? [];
  const filteredSubs = !userSearch
    ? subscribers
    : subscribers.filter((s) =>
        s.email.toLowerCase().includes(userSearch.toLowerCase())
      );

  // Send to all
  const campaignMutation = useMutation({
    mutationFn: () => apiSendCampaign(form),
    onSuccess: () => {
      toast.success("Campaign sent to all subscribers!");
      setForm(EMPTY_FORM);
    },
    onError: (err: Error) => toast.error(err.message || "Failed to send campaign"),
  });

  // Send to single user
  // const singleMutation = useMutation({
  //   mutationFn: () => apiSendUserMessage(selectedUser!.id, form),
  //   onSuccess: () => {
  //     toast.success(`Message sent to ${selectedUser!.email}`);
  //     setForm(EMPTY_FORM);
  //     setSelectedUser(null);
  //     setMode("all");
  //   },
  //   onError: (err: Error) => toast.error(err.message || "Failed to send message"),
  // });

  const isPending = campaignMutation.isPending 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    if (mode === "single" && !selectedUser) {
      toast.error("Please select a recipient");
      return;
    }
    if (mode === "all") {
      campaignMutation.mutate();
    } 
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Send Newsletter</h1>
        <p className="text-brand-mid text-sm mt-1">
          Send a campaign to all subscribers or a direct message to a single user
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-3">
        {([
          { key: "all",    label: "Send to All Subscribers", icon: Users },
          // { key: "single", label: "Send to Single User",     icon: User },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setMode(key); setSelectedUser(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              mode === key
                ? "bg-brand-accent text-brand-black border-brand-accent"
                : "border-brand-mid/30 text-brand-mid hover:text-white hover:border-brand-mid/60 bg-brand-card"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-brand-card border border-brand-mid/30 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Single user picker */}
            {/* {mode === "single" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium flex items-center gap-1.5">
                  <User size={13} /> Recipient *
                </label>
                {selectedUser ? (
                  <div className="flex items-center justify-between bg-brand-raised border border-brand-mid/30
                    rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-accent flex items-center justify-center
                        text-brand-black text-xs font-bold">
                        {selectedUser.email[0].toUpperCase()}
                      </div>
                      <span className="text-white text-sm">{selectedUser.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="text-brand-mid hover:text-red-400 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setUserPickerOpen(true)}
                    className="text-left border border-dashed border-brand-mid/40 rounded-lg px-4 py-2.5
                      text-brand-mid text-sm hover:border-brand-accent/60 hover:text-white transition-colors"
                  >
                    Click to select a subscriber…
                  </button>
                )}
              </div>
            )} */}

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium flex items-center gap-1.5">
                <Type size={13} /> Email Subject / Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. 🎨 New Paints Just Dropped!"
                className={inputCls}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium flex items-center gap-1.5">
                <AlignLeft size={13} /> Message *
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                rows={6}
                placeholder="Write your message here. Keep it clear and engaging…"
                className={`${inputCls} resize-none`}
              />
              <p className="text-brand-subtle text-[11px] text-right">{form.message.length} chars</p>
            </div>

            {/* CTA Button (optional) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium flex items-center gap-1.5">
                  <Type size={13} /> Button Text (optional)
                </label>
                <input
                  value={form.buttonText}
                  onChange={(e) => setForm((p) => ({ ...p, buttonText: e.target.value }))}
                  placeholder="e.g. Shop Now"
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium flex items-center gap-1.5">
                  <Link2 size={13} /> Button Link (optional)
                </label>
                <input
                  value={form.buttonLink}
                  onChange={(e) => setForm((p) => ({ ...p, buttonLink: e.target.value }))}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                font-semibold py-3 rounded-lg hover:bg-brand-accent-lt transition-all text-sm
                disabled:opacity-50 mt-2"
            >
              {isPending ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
              {isPending
                ? "Sending..."
                : mode === "all"
                ? "Send to All Subscribers"
                : `Send to ${selectedUser?.email ?? "Selected User"}`}
            </button>
          </form>
        </div>

        {/* Info sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-brand-card border border-brand-mid/30 rounded-xl p-5">
            <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">
              {mode === "all" ? "Campaign Reach" : "Single Message"}
            </p>
            {mode === "all" ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent-muted border border-brand-accent/20
                    flex items-center justify-center">
                    <Mail size={18} className="text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl font-display">
                      {subscribers.length}
                    </p>
                    <p className="text-brand-mid text-xs">total subscribers</p>
                  </div>
                </div>
                <p className="text-brand-mid text-xs leading-relaxed">
                  This campaign will be sent to all newsletter subscribers and users on your website.
                  Make sure your content is relevant and engaging.
                </p>
              </>
            ) : (
              <p className="text-brand-mid text-xs leading-relaxed">
                Select a subscriber from your list. The message will be sent directly to
                that single email address using the same email template.
              </p>
            )}
          </div>

          <div className="bg-brand-card border border-brand-mid/30 rounded-xl p-5">
            <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">
              Tips
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Keep subject lines under 60 characters",
                "Start your message with the most important info",
                "Add a clear call-to-action button link",
                "Test with a single user before sending to all",
              ].map((tip) => (
                <li key={tip} className="text-brand-mid text-xs flex items-start gap-2">
                  <span className="text-brand-accent mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* User picker modal */}
      {userPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => { setUserPickerOpen(false); setUserSearch(""); }}
          />
          <div className="relative z-10 bg-brand-card border border-brand-mid/40 rounded-xl shadow-2xl
            w-full max-w-md animate-fade-in max-h-[70vh] flex flex-col">
            {/* Picker header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-mid/20">
              <h3 className="text-white font-semibold text-sm">Select Subscriber</h3>
              <button
                onClick={() => { setUserPickerOpen(false); setUserSearch(""); }}
                className="text-brand-mid hover:text-white p-1 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-brand-mid/20">
              <div className="flex items-center gap-2 bg-brand-raised border border-brand-mid/30
                rounded-lg px-3 py-2">
                <User size={13} className="text-brand-mid" />
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by email..."
                  autoFocus
                  className="bg-transparent text-white text-sm placeholder-brand-mid outline-none flex-1"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {subLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader size={20} className="animate-spin text-brand-accent" />
                </div>
              ) : filteredSubs.length === 0 ? (
                <p className="text-brand-mid text-sm text-center py-8">No subscribers found</p>
              ) : (
                filteredSubs.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedUser(sub);
                      setUserPickerOpen(false);
                      setUserSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-raised
                      transition-colors text-left border-b border-brand-mid/10 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-accent-muted border border-brand-accent/20
                      flex items-center justify-center flex-shrink-0 text-brand-accent font-bold text-xs">
                      {sub.email[0].toUpperCase()}
                    </div>
                    <span className="text-brand-lt-gray text-sm">{sub.email}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}