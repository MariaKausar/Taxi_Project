
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_date DATE,
  pickup_time TIME,
  passengers INTEGER,
  luggage INTEGER,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);
