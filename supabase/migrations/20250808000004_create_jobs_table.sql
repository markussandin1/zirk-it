CREATE TABLE public.jobs (
    id uuid PRIMARY KEY,
    status text NOT NULL,
    progress integer NOT NULL,
    result jsonb,
    error text,
    page_id uuid REFERENCES public.pages(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are public" ON public.jobs FOR SELECT USING (true);

CREATE POLICY "Anyone can create a job" ON public.jobs FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their own job" ON public.jobs FOR UPDATE USING (true);
