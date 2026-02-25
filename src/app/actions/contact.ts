"use server";

export async function submitContact(formData: FormData): Promise<void> {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  if (!name || !email || !message) return;

  // Stub: in production, send email or persist to DB
  await new Promise((r) => setTimeout(r, 500));
}
