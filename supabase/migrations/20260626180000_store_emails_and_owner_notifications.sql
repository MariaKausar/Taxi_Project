-- Store customer emails on bookings, track owner notification delivery,
-- and persist contact form submissions with owner inbox metadata.

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS owner_notification_emails TEXT,
  ADD COLUMN IF NOT EXISTS owner_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS owner_email_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS owner_email_provider TEXT;

COMMENT ON COLUMN public.bookings.customer_email IS 'Email address entered by the customer on the booking form';
COMMENT ON COLUMN public.bookings.owner_notification_emails IS 'Owner inbox(es) notified for this booking (comma-separated)';

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  message TEXT NOT NULL,
  owner_notification_emails TEXT,
  owner_email_sent_at TIMESTAMPTZ,
  owner_email_status TEXT NOT NULL DEFAULT 'pending',
  owner_email_provider TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.contact_messages.customer_email IS 'Email address entered on the contact form';
COMMENT ON COLUMN public.contact_messages.owner_notification_emails IS 'Owner inbox(es) notified for this message (comma-separated)';

GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update contact messages"
ON public.contact_messages FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);
