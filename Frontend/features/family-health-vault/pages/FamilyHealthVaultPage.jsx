"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Heart,
  CalendarBlank,
  Robot,
  ChartLine,
  Gear,
  MagnifyingGlass,
  CaretRight,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Badge } from "@/shared/components/Badge";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";
import {
  useFamilyVault,
  useFamilyDashboard,
  useFamilyCalendar,
  useFamilyAiInsights,
  useFamilyWeeklySummary,
  useCreateFamily,
  useUpdateFamily,
  useAddFamilyMember,
  useFamilyCopilotQuery,
} from "@/lib/hooks/useApi";
import {
  RELATIONSHIPS,
  BLOOD_GROUPS,
  VAULT_VIEWS,
  EMPTY_FAMILY,
  EMPTY_MEMBER,
  relationshipEmoji,
  scoreColor,
  formatDate,
} from "../lib/constants";

const VIEW_ICONS = {
  dashboard: Heart,
  calendar: CalendarBlank,
  copilot: Robot,
  summary: ChartLine,
  settings: Gear,
};

export function FamilyHealthVaultPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openSignIn } = useAuthModal();
  const [view, setView] = useState("dashboard");
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [familyForm, setFamilyForm] = useState(EMPTY_FAMILY);
  const [memberForm, setMemberForm] = useState(EMPTY_MEMBER);
  const [copilotQuestion, setCopilotQuestion] = useState("");
  const [copilotAnswer, setCopilotAnswer] = useState(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    home_address: "",
    emergency_contact: "",
    preferred_hospital: "",
    preferred_pharmacy: "",
    preferred_lab: "",
  });

  const { data: vault, isLoading, isError, refetch, isFetching } = useFamilyVault({ enabled: isAuthenticated });
  const { data: dashboard } = useFamilyDashboard({ enabled: isAuthenticated && Boolean(vault) });
  const { data: calendarEvents = [] } = useFamilyCalendar({ enabled: isAuthenticated && Boolean(vault) && view === "calendar" });
  const { data: aiInsights } = useFamilyAiInsights({ enabled: isAuthenticated && Boolean(vault) });
  const { data: weeklySummary } = useFamilyWeeklySummary({ enabled: isAuthenticated && Boolean(vault) && view === "summary" });

  const createFamily = useCreateFamily();
  const updateFamily = useUpdateFamily();
  const addMember = useAddFamilyMember();
  const copilotQuery = useFamilyCopilotQuery();

  useEffect(() => {
    if (vault) {
      setSettingsForm({
        home_address: vault.home_address || "",
        emergency_contact: vault.emergency_contact || "",
        preferred_hospital: vault.preferred_hospital || "",
        preferred_pharmacy: vault.preferred_pharmacy || "",
        preferred_lab: vault.preferred_lab || "",
      });
    }
  }, [vault]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateFamily.mutateAsync(settingsForm);
      toast.success("Family settings updated successfully");
      setIsEditingSettings(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update settings");
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) openSignIn({ redirect: "/family-health" });
  }, [authLoading, isAuthenticated, openSignIn]);

  const handleCreateFamily = async (e) => {
    e.preventDefault();
    try {
      await createFamily.mutateAsync(familyForm);
      toast.success("Family health vault created");
      setShowCreateFamily(false);
      setFamilyForm(EMPTY_FAMILY);
    } catch (err) {
      toast.error(err.message || "Failed to create family");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await addMember.mutateAsync({
        ...memberForm,
        height_cm: memberForm.height_cm ? Number(memberForm.height_cm) : undefined,
        weight_kg: memberForm.weight_kg ? Number(memberForm.weight_kg) : undefined,
        medical_profile: { conditions: [], allergies: { medicine: [], food: [], environmental: [] }, surgeries: [], familyHistory: [], lifestyle: {} },
      });
      toast.success("Family member added");
      setShowAddMember(false);
      setMemberForm(EMPTY_MEMBER);
    } catch (err) {
      toast.error(err.message || "Failed to add member");
    }
  };

  const handleCopilotAsk = async (e) => {
    e.preventDefault();
    if (!copilotQuestion.trim()) return;
    try {
      const res = await copilotQuery.mutateAsync(copilotQuestion.trim());
      setCopilotAnswer(res);
    } catch (err) {
      toast.error(err.message || "Copilot unavailable");
    }
  };

  if (authLoading || (isAuthenticated && isLoading && !isError)) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-[80px] py-12 text-center text-[var(--color-neutral-500)]">
        Loading family health vault...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-[720px] mx-auto px-4 md:px-[80px] py-12 text-center">
        <h1 className="text-[28px] font-bold mb-2">Family Health Vault</h1>
        <p className="text-[15px] text-[var(--color-neutral-600)] mb-6">Sign in to create and manage your family health records.</p>
        <Button onClick={() => openSignIn({ redirect: "/family-health" })}>Sign In</Button>
      </div>
    );
  }

  if (isError && !vault) {
    return (
      <div className="max-w-[720px] mx-auto px-4 md:px-[80px] py-12">
        <div className="rounded-[16px] border border-amber-200 bg-amber-50 p-4 mb-6 text-left">
          <p className="font-semibold text-amber-900">Could not reach Family Health Vault API</p>
          <p className="text-[14px] text-amber-800 mt-1">Run backend migration: <code className="text-[13px]">npx prisma migrate deploy</code></p>
          <Button className="mt-3" variant="secondary" onClick={() => refetch()} isLoading={isFetching}>Retry</Button>
        </div>
        <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-8 text-center">
          <h1 className="text-[28px] font-bold mb-2">Family Health Vault</h1>
          <p className="text-[15px] text-[var(--color-neutral-600)] mb-6">Create your family once the backend is ready.</p>
          {!showCreateFamily ? (
            <Button onClick={() => setShowCreateFamily(true)}>Create Family</Button>
          ) : (
            <form onSubmit={handleCreateFamily} className="text-left space-y-4 max-w-md mx-auto">
              <h2 className="text-[18px] font-semibold text-center mb-2">Create Your Family</h2>
              <Input label="Family Name (optional)" value={familyForm.name} onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })} />
              <Input label="Home Address" value={familyForm.home_address} onChange={(e) => setFamilyForm({ ...familyForm, home_address: e.target.value })} />
              <Input label="Emergency Contact" value={familyForm.emergency_contact} onChange={(e) => setFamilyForm({ ...familyForm, emergency_contact: e.target.value })} />
              <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={createFamily.isPending} className="flex-1">Create Family</Button>
                <Button type="button" variant="secondary" onClick={() => setShowCreateFamily(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!vault) {
    return (
      <div className="max-w-[720px] mx-auto px-4 md:px-[80px] py-12">
        <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-brand-primary)]/10 mb-4">
            <Users size={32} className="text-[var(--color-brand-primary)]" />
          </div>
          <h1 className="text-[28px] font-bold mb-2">Family Health Vault</h1>
          <p className="text-[15px] text-[var(--color-neutral-600)] mb-6 max-w-md mx-auto">
            One account to manage health records, medicines, appointments, and emergencies for your entire family.
          </p>
          {!showCreateFamily ? (
            <Button onClick={() => setShowCreateFamily(true)}>Create Family</Button>
          ) : (
            <form onSubmit={handleCreateFamily} className="text-left space-y-4 max-w-md mx-auto">
              <h2 className="text-[18px] font-semibold text-center mb-2">Create Your Family</h2>
              <Input label="Family Name (optional)" value={familyForm.name} onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })} />
              <Input label="Home Address" value={familyForm.home_address} onChange={(e) => setFamilyForm({ ...familyForm, home_address: e.target.value })} />
              <Input label="Emergency Contact" value={familyForm.emergency_contact} onChange={(e) => setFamilyForm({ ...familyForm, emergency_contact: e.target.value })} />
              <Input label="Preferred Hospital" value={familyForm.preferred_hospital} onChange={(e) => setFamilyForm({ ...familyForm, preferred_hospital: e.target.value })} />
              <Input label="Preferred Pharmacy" value={familyForm.preferred_pharmacy} onChange={(e) => setFamilyForm({ ...familyForm, preferred_pharmacy: e.target.value })} />
              <Input label="Preferred Lab" value={familyForm.preferred_lab} onChange={(e) => setFamilyForm({ ...familyForm, preferred_lab: e.target.value })} />
              <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={createFamily.isPending} className="flex-1">Create Family</Button>
                <Button type="button" variant="secondary" onClick={() => setShowCreateFamily(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const members = dashboard?.members || vault.dashboard || vault.members || [];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[80px] py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-[13px] font-medium text-[var(--color-brand-primary)] uppercase tracking-wide mb-1">Family Health</p>
          <h1 className="text-[28px] font-bold">{vault.name || "Family Health Vault"}</h1>
          {dashboard?.overall_score != null && (
            <p className="text-[14px] text-[var(--color-neutral-600)] mt-1">
              Overall Family Health Score: <span className="font-semibold">{dashboard.overall_score}</span>
            </p>
          )}
        </div>
        <Button onClick={() => setShowAddMember(true)}>
          <Plus size={18} /> Add Member
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-[220px] shrink-0">
          <nav className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-2 space-y-1">
            {VAULT_VIEWS.map((item) => {
              const Icon = VIEW_ICONS[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-colors ${
                    view === item.id
                      ? "bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
                      : "text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {view === "dashboard" && (
            <div className="space-y-4">
              {aiInsights?.members?.some((m) => m.alerts?.length) && (
                <div className="rounded-[16px] border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkle size={18} className="text-amber-600" />
                    <h2 className="font-semibold text-amber-900">AI Monitoring</h2>
                  </div>
                  <p className="text-[13px] text-amber-800 mb-3">{aiInsights.disclaimer}</p>
                  <div className="space-y-2">
                    {aiInsights.members.flatMap((m) =>
                      (m.alerts || []).map((a, i) => (
                        <p key={`${m.member_id}-${i}`} className="text-[14px] text-amber-900">
                          <strong>{m.member_name}:</strong> {a.message}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {members.length === 0 ? (
                  <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                    <p className="text-[var(--color-neutral-500)] mb-4">No family members yet. Add your first member to get started.</p>
                    <Button onClick={() => setShowAddMember(true)}>Add Member</Button>
                  </div>
                ) : (
                  members.map((member) => {
                    const memberId = member.id || member._id || member.member_id;
                    return (
                      <Link
                        key={memberId}
                        href={`/family-health/members/${memberId}`}
                        className="block rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-5 hover:border-[var(--color-brand-primary)]/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <span className="text-3xl">{relationshipEmoji(member.relationship)}</span>
                            <div>
                              <h3 className="text-[18px] font-bold">{member.full_name}</h3>
                              <p className="text-[13px] text-[var(--color-neutral-500)]">{member.relationship}</p>
                              <div className="mt-2 space-y-1">
                                {(member.status_lines || []).map((line, i) => (
                                  <p key={i} className="text-[14px] text-[var(--color-neutral-700)]">{line}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[13px] font-semibold ${scoreColor(member.health_score)}`}>
                              Score: {member.health_score ?? "—"}
                            </span>
                            <CaretRight size={20} className="text-[var(--color-neutral-400)]" />
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {view === "calendar" && (
            <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-6">
              <h2 className="text-[20px] font-bold mb-4">Shared Family Calendar</h2>
              {calendarEvents.length === 0 ? (
                <p className="text-[14px] text-[var(--color-neutral-500)]">No upcoming events. Add appointments, medicine refills, or vaccinations from member profiles.</p>
              ) : (
                <div className="space-y-3">
                  {calendarEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-[10px] bg-[var(--color-neutral-50)]">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-[13px] text-[var(--color-neutral-500)]">{event.member_name} · {event.type.replace(/_/g, " ")}</p>
                      </div>
                      <Badge variant="secondary">{formatDate(event.date)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "copilot" && (
            <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-6">
              <h2 className="text-[20px] font-bold mb-2">AI Family Copilot</h2>
              <p className="text-[14px] text-[var(--color-neutral-600)] mb-6">
                Ask about medicines, appointments, vaccinations, vitals, and conditions across your family.
              </p>
              <form onSubmit={handleCopilotAsk} className="flex gap-3 mb-6">
                <Input
                  placeholder="e.g. Who missed their medicine today?"
                  value={copilotQuestion}
                  onChange={(e) => setCopilotQuestion(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" isLoading={copilotQuery.isPending}>
                  <MagnifyingGlass size={18} /> Ask
                </Button>
              </form>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  "How is my father's diabetes?",
                  "Which family members have appointments this week?",
                  "What vaccinations are due this month?",
                  "Show my mother's blood pressure trend.",
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setCopilotQuestion(q)}
                    className="text-[13px] px-3 py-1.5 rounded-full border border-[var(--color-neutral-200)] hover:border-[var(--color-brand-primary)] text-[var(--color-neutral-700)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
              {copilotAnswer && (
                <div className="rounded-[12px] bg-[var(--color-neutral-50)] p-4">
                  <p className="text-[15px]">{copilotAnswer.answer}</p>
                  {copilotAnswer.memberId && (
                    <Link href={`/family-health/members/${copilotAnswer.memberId}`} className="inline-block mt-3 text-[14px] text-[var(--color-brand-primary)] font-medium">
                      View profile →
                    </Link>
                  )}
                  <p className="text-[12px] text-[var(--color-neutral-500)] mt-3">{copilotAnswer.disclaimer}</p>
                </div>
              )}
            </div>
          )}

          {view === "summary" && weeklySummary && (
            <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-6">
              <h2 className="text-[20px] font-bold mb-1">Weekly Family Health Summary</h2>
              <p className="text-[13px] text-[var(--color-neutral-500)] mb-6">Generated {formatDate(weeklySummary.generated_at)}</p>
              <div className="space-y-5">
                {weeklySummary.members.map((m) => (
                  <div key={m.id} className="border-b border-[var(--color-neutral-100)] pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{m.name} ({m.relationship})</h3>
                      <span className={`text-[13px] font-semibold px-2 py-0.5 rounded-full ${scoreColor(m.health_score)}`}>{m.health_score}</span>
                    </div>
                    <ul className="list-disc list-inside text-[14px] text-[var(--color-neutral-700)] space-y-1">
                      {m.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              {weeklySummary.overall_family_health_score != null && (
                <p className="mt-6 font-semibold">Overall Family Health Score: {weeklySummary.overall_family_health_score}</p>
              )}
              <p className="text-[12px] text-[var(--color-neutral-500)] mt-4">{weeklySummary.disclaimer}</p>
            </div>
          )}

          {view === "settings" && (
            <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[20px] font-bold text-[var(--color-ink-headline)]">Family Settings</h2>
                  <p className="text-[13px] text-[var(--color-neutral-500)] mt-0.5">
                    Manage your family's address, emergency contacts, and preferred healthcare providers.
                  </p>
                </div>
                {!isEditingSettings && (
                  <Button variant="secondary" onClick={() => setIsEditingSettings(true)}>
                    Edit Settings
                  </Button>
                )}
              </div>

              {isEditingSettings ? (
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                  <Input
                    label="Home Address"
                    placeholder="Enter family home address"
                    value={settingsForm.home_address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, home_address: e.target.value })}
                  />
                  <Input
                    label="Emergency Contact"
                    placeholder="e.g. +92 300 1234567 (Emergency)"
                    value={settingsForm.emergency_contact}
                    onChange={(e) => setSettingsForm({ ...settingsForm, emergency_contact: e.target.value })}
                  />
                  <Input
                    label="Preferred Hospital"
                    placeholder="e.g. Shifa International Hospital"
                    value={settingsForm.preferred_hospital}
                    onChange={(e) => setSettingsForm({ ...settingsForm, preferred_hospital: e.target.value })}
                  />
                  <Input
                    label="Preferred Pharmacy"
                    placeholder="e.g. D.Watson Pharmacy"
                    value={settingsForm.preferred_pharmacy}
                    onChange={(e) => setSettingsForm({ ...settingsForm, preferred_pharmacy: e.target.value })}
                  />
                  <Input
                    label="Preferred Lab"
                    placeholder="e.g. Chughtai Lab"
                    value={settingsForm.preferred_lab}
                    onChange={(e) => setSettingsForm({ ...settingsForm, preferred_lab: e.target.value })}
                  />
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={updateFamily.isPending}>
                      {updateFamily.isPending ? "Saving..." : "Save Settings"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setIsEditingSettings(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <dl className="grid gap-3.5 text-[14px]">
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-neutral-500)] mb-1">Home Address</dt>
                    <dd className="font-semibold text-[var(--color-ink-headline)]">{vault?.home_address || "—"}</dd>
                  </div>
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-neutral-500)] mb-1">Emergency Contact</dt>
                    <dd className="font-semibold text-[var(--color-ink-headline)]">{vault?.emergency_contact || "—"}</dd>
                  </div>
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-neutral-500)] mb-1">Preferred Hospital</dt>
                    <dd className="font-semibold text-[var(--color-ink-headline)]">{vault?.preferred_hospital || "—"}</dd>
                  </div>
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-neutral-500)] mb-1">Preferred Pharmacy</dt>
                    <dd className="font-semibold text-[var(--color-ink-headline)]">{vault?.preferred_pharmacy || "—"}</dd>
                  </div>
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-neutral-500)] mb-1">Preferred Lab</dt>
                    <dd className="font-semibold text-[var(--color-ink-headline)]">{vault?.preferred_lab || "—"}</dd>
                  </div>
                </dl>
              )}
            </div>
          )}
        </main>
      </div>

      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-[20px] font-bold mb-4">Add Family Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <Input label="Full Name" required value={memberForm.full_name} onChange={(e) => setMemberForm({ ...memberForm, full_name: e.target.value })} />
              <label className="block text-[13px] font-medium text-[var(--color-neutral-700)]">
                Relationship
                <select
                  className="mt-1 w-full rounded-[10px] border border-[var(--color-neutral-200)] px-3 py-2 text-[14px]"
                  value={memberForm.relationship}
                  onChange={(e) => setMemberForm({ ...memberForm, relationship: e.target.value })}
                >
                  {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date of Birth" type="date" value={memberForm.date_of_birth} onChange={(e) => setMemberForm({ ...memberForm, date_of_birth: e.target.value })} />
                <label className="block text-[13px] font-medium text-[var(--color-neutral-700)]">
                  Gender
                  <select className="mt-1 w-full rounded-[10px] border border-[var(--color-neutral-200)] px-3 py-2 text-[14px]" value={memberForm.gender} onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="block text-[13px] font-medium text-[var(--color-neutral-700)]">
                  Blood Group
                  <select className="mt-1 w-full rounded-[10px] border border-[var(--color-neutral-200)] px-3 py-2 text-[14px]" value={memberForm.blood_group} onChange={(e) => setMemberForm({ ...memberForm, blood_group: e.target.value })}>
                    {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </label>
                <Input label="Height (cm)" type="number" value={memberForm.height_cm} onChange={(e) => setMemberForm({ ...memberForm, height_cm: e.target.value })} />
                <Input label="Weight (kg)" type="number" value={memberForm.weight_kg} onChange={(e) => setMemberForm({ ...memberForm, weight_kg: e.target.value })} />
              </div>
              <Input label="Phone (optional)" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} />
              <Input label="Email (optional)" type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
              <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={addMember.isPending} className="flex-1">Add Member</Button>
                <Button type="button" variant="secondary" onClick={() => setShowAddMember(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
