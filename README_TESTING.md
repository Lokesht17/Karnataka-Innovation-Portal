# Karnataka Innovation Portal - Testing Guide

## Overview
This guide explains how to test the complete submission/approval workflow with document uploads.

## Setup

### 1. Create Test Users

You'll need accounts for different roles. After signing up, assign roles using SQL:

```sql
-- Make a user an admin (replace USER_ID with actual user ID from auth.users)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'admin');

-- Make a user a researcher
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'researcher');

-- Make a user a startup founder
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'startup');

-- Make a user an investor
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'investor');
```

### 2. Get User IDs

To find user IDs for role assignment:

```sql
SELECT id, email FROM auth.users;
```

## Testing Workflows

### A. Research Project Submission & Approval

**As Researcher:**
1. Sign in as researcher
2. Navigate to "Research" page
3. Click "Submit New Project"
4. Fill in required fields:
   - Project Title
   - Abstract
   - Institution
   - Optional: Funding Amount, Duration
5. Upload a PDF/DOC file (test document)
6. Click "Submit Project"
7. ✅ Verify: Project appears in your list with status "SUBMITTED"
8. ✅ Verify: You can view the uploaded document

**As Admin:**
1. Sign in as admin
2. Navigate to "Dashboard"
3. ✅ Verify: Pending project appears in "Pending Approvals" section
4. Click "View Document" to review the uploaded file
5. Click "Approve" or "Reject"
6. Add optional review comment (for rejection)
7. Confirm action
8. ✅ Verify: Project status changes to "APPROVED" or "REJECTED"

**As Investor:**
1. Sign in as investor
2. Navigate to "Research" page
3. ✅ Verify: Only approved projects are visible
4. ✅ Verify: Can view project documents

---

### B. Patent Filing & Approval

**As Researcher/Startup:**
1. Sign in as researcher or startup founder
2. Navigate to "IPR" page
3. Click "File New Patent"
4. Fill in required fields:
   - Patent Title
   - Inventor(s)
   - Institution
   - Optional: Application Number, Description
5. Upload patent document (PDF)
6. Click "File Patent"
7. ✅ Verify: Patent appears with status "FILED"
8. ✅ Verify: Document is accessible

**As Admin:**
1. Sign in as admin
2. Navigate to "Dashboard" → Pending Approvals section
3. ✅ Verify: Patent appears in pending list
4. Review patent document
5. Click "Grant" or "Reject"
6. Confirm action
7. ✅ Verify: Patent status changes to "GRANTED" or "REJECTED"

---

### C. Startup Registration & Verification

**As Startup Founder:**
1. Sign in as startup founder
2. Navigate to "Startups" page
3. Click "Register Startup"
4. Fill in required fields:
   - Company Name
   - Founder Name
   - Sector
   - Stage
   - Optional: Recognition ID, Funding, Description
5. Upload business plan/pitch deck (PDF/PPT)
6. Click "Register Startup"
7. ✅ Verify: Startup appears with "PENDING" verification status
8. ✅ Verify: Document can be viewed

**As Admin:**
1. Sign in as admin
2. Navigate to "Dashboard" → Pending Approvals
3. ✅ Verify: Startup appears in pending startups list
4. Review startup document
5. Click "Verify"
6. Confirm verification
7. ✅ Verify: Startup status changes to "VERIFIED"

**As Investor:**
1. Sign in as investor
2. Navigate to "Startups" page
3. ✅ Verify: Only verified startups are visible
4. Click "Express Interest" on a startup
5. Enter investment amount (optional) and message
6. Submit interest
7. ✅ Verify: Success message displayed

---

## Document Access Testing

### File Upload Requirements
- Research: PDF, DOC, DOCX (project proposals)
- Patents: PDF (patent documents)
- Startups: PDF, PPT, PPTX (business plans, pitch decks)

### Storage Verification

Check uploaded files in Supabase Storage:

```sql
-- View all uploaded documents
SELECT * FROM storage.objects 
WHERE bucket_id = 'project-documents';
```

### Document Access Rules
- ✅ Users can view their own uploaded documents
- ✅ Admins can view all documents
- ✅ Investors can view documents of approved/verified items
- ❌ Unauthenticated users cannot access documents

---

## Role-Based Access Control Testing

Test that each role can only:

**Researcher:**
- ✅ Submit research projects with documents
- ✅ File patents with documents
- ✅ View own submissions
- ❌ Cannot approve/reject anything
- ❌ Cannot see other users' pending items

**Startup:**
- ✅ Register startups with documents
- ✅ File patents with documents
- ✅ View own submissions
- ❌ Cannot submit research projects
- ❌ Cannot verify startups

**Admin:**
- ✅ View all submissions (pending and approved)
- ✅ Approve/reject research projects
- ✅ Grant/reject patents
- ✅ Verify/reject startups
- ✅ View all documents
- ✅ Access Dashboard with Pending Approvals section

**Investor:**
- ✅ View approved research projects
- ✅ View verified startups
- ✅ Express interest in startups
- ✅ View documents of approved items
- ❌ Cannot submit or approve anything

---

## Status Flow Validation

### Research Projects
```
submitted → (admin action) → approved/rejected
```

### Patents
```
filed → (admin action) → granted/rejected
```

### Startups
```
is_verified: false → (admin action) → is_verified: true
```

---

## Common Issues & Solutions

### Issue: "No file uploaded" error
**Solution:** Ensure file size < 50MB and correct file type

### Issue: Cannot see document
**Solution:** Check RLS policies and user role permissions

### Issue: User role not working
**Solution:** Verify user_roles table has correct entry:
```sql
SELECT * FROM public.user_roles WHERE user_id = 'USER_ID';
```

### Issue: Status not updating
**Solution:** Check browser console for errors and verify admin role

---

## SQL Queries for Verification

```sql
-- Check all pending research projects
SELECT id, title, status, created_at 
FROM research_projects 
WHERE status IN ('submitted', 'under_review');

-- Check all pending patents
SELECT id, title, status, filed_date 
FROM patents 
WHERE status = 'filed';

-- Check unverified startups
SELECT id, company_name, is_verified, created_at 
FROM startups 
WHERE is_verified = false;

-- Check investor interests
SELECT * FROM investor_interest 
ORDER BY created_at DESC;

-- View user roles
SELECT ur.user_id, p.email, ur.role 
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
JOIN profiles p ON ur.user_id = p.id;
```

---

## Success Criteria

✅ **All tests pass if:**
1. Researchers can submit projects with documents
2. Startups can register with business plans
3. Patents can be filed with documents
4. Admin sees all pending items in Dashboard
5. Admin can approve/reject with confirmation
6. Approved items become visible to investors
7. Documents are securely stored and accessible based on role
8. Status badges display correctly
9. No unauthorized access to pending items
10. Toast notifications confirm all actions

---

## Environment Setup

Ensure these environment variables are set:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

The Supabase client is already configured in `src/integrations/supabase/client.ts`

---

## Support

For issues or questions:
- Email: support@karnatakagovt.in
- Documentation: https://docs.lovable.dev

---

**Note:** This is a government-grade application. Ensure all sensitive data is handled according to Karnataka State IT policies.
