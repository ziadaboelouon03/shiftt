-- Allow admins to view all housing applications
CREATE POLICY "Admins can view all applications"
ON public.housing_applications
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update application status
CREATE POLICY "Admins can update applications"
ON public.housing_applications
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));