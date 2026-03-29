# TODO: Integrate Admin Panel with Featured Hospitals (Rumah Sakit Unggulan)

## Status: 🟢 Complete ✅

### 1. [✅] Update Types (`types/index.ts`)
   - Add `isFeatured?: boolean;` to Hospital interface

### 2. [✅] Update Services (`services/hospital.tsx`)
   - Add `toggleHospitalFeatured` function

### 3. [✅] Update AppContext (`context/AppContext.tsx`)
   - Add `toggleFeaturedHospital` method
   - Map `is_featured` ↔ `isFeatured` in `mapHospital`

### 4. [ ] Update Admin Panel List (`app/admin/page.tsx`)
   - Add "Unggulan" column/badge
   - Add toggle switch per row

### 5. [ ] Update Admin Form (`app/admin/page.tsx` - HospitalFormModal)
   - Add featured checkbox

### 6. [ ] Update HospitalCard (`components/HospitalCard.tsx`)
   - Add featured badge (gold star)

### 7. [ ] Update HospitalGrid (`components/HospitalGrid.tsx`)
   - Featured section at top
   - Sort featured first

### Follow-up
- Test admin toggle → realtime → UI updates
- Run `npm run dev`
- Mark complete with attempt_completion

**Next Step: #1 types/index.ts**
