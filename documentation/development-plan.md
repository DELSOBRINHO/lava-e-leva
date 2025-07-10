# Development Plan - Lava-e-Leva

## Minimal App Flow

1. **Customer opens the app** → Chooses laundry → Selects service → Schedules pickup.
2. **Delivery receives order** → Confirms pickup → Takes to laundry.
3. **Laundry receives clothes** → Updates status → Notifies when ready.
4. **Delivery picks up at laundry** → Delivers to customer.
5. **Customer receives and reviews.**

---

## Features Checklist

### 1. Customer Frontend (Web + Mobile)
- [x] Registration/Login (Email, phone, Google/Apple login)
- [x] Laundry Search (Filter by location, rating, price, services)
- [x] Service Selection (Simple wash, ironing, dry cleaning, express delivery)
- [x] Scheduling (Date/time for pickup and delivery)
- [ ] Payment (Card, PIX, app balance)
- [x] Order Tracking (Status: "Picked up", "Washing", "On the way")
- [ ] Notifications (Push/WhatsApp for updates)
- [ ] Review (Feedback for laundry and delivery)
- [ ] Order History (View previous orders)
- [x] Show average ratings for laundry and delivery
- [x] Automatic profile creation after authentication

**Additional Ideas:**
- [ ] "One-touch Wash" (Quick order based on last used service)
- [ ] "Eco Mode" (Sustainable wash option with discount)
- [ ] QR Code for Identification (Facilitates pickup without paper)
- [ ] Subscription Package (Discounts for frequent customers)

---

### 2. Delivery Frontend (Mobile)
- [ ] Registration/Verification (Driver's license, vehicle document, selfie)
- [x] Online Availability ("Active/Inactive" mode to receive orders)
- [x] Accept/Reject Orders (With response time limit)
- [ ] Pickup/Delivery Route (Integration with Google Maps/Waze)
- [x] Step Confirmation (order status update)
- [ ] Payment (Per delivery + tip)
- [x] Delivery History (Daily/weekly earnings report)

**Additional Ideas:**
- [ ] "Turbo Mode" (Prioritizes higher paying orders)
- [ ] Quick Chat (With customer/laundry in case of questions)
- [ ] Distinct Sound Notification (Not to confuse with other apps)

---

### 3. Laundry Frontend (Web/Desktop + Mobile)
- [ ] Registration/Verification (CNPJ, establishment photos)
- [x] Order Management (Panel with status: "Waiting", "Washing", "Ready")
- [ ] Prices and Services (Edit values, deadlines, promotions)
- [ ] Communication (Chat with customer/delivery)
- [ ] Reports (Revenue, completed, canceled orders)
- [ ] Inventory Control (Products used: soap, softener)
- [x] Order status update (Laundry and Delivery)

**Additional Ideas:**
- [ ] "Autonomous Mode" (Accepts only orders that fit current capacity)
- [ ] Peak Notification (High demand alerts at certain times)
- [ ] Machine Integration (IoT to automatically update status)

---

### Backend & Infrastructure
- [x] Centralized API (Manages customers, deliveries, laundries)
- [x] Database (Stores orders, users, history)
- [ ] Payment Gateway (Stripe, Mercado Pago, PagSeguro)
- [x] In-app Notification System (custom messages per event)
- [ ] Analytics (Monitors retention, cancellations, reviews)
- [x] Security (Data encryption, LGPD compliance)

---

## Automatic profile creation and permissions

### How it works
- After user registration and authentication (via Supabase Auth), the frontend ensures there is a corresponding record in the `profiles` table.
- The `role` field is set according to the user's choice at registration ("customer", "delivery", "laundry").
- The `useEnsureProfile` hook checks and creates the profile if necessary, right after login/registration.

---

## Payment flow (MVP)

- The customer chooses the payment method (PIX, credit card, app balance) when scheduling the order.
- The method and payment status ("pending" or "paid") are saved in the order.
- The customer can simulate payment by clicking "Mark as paid" on the order tracking screen.
- The order status can only be advanced by the laundry after payment is confirmed (status "paid").
- Visual notifications inform success or error when marking as paid.
- Ready for future integration with real gateway (Stripe, Mercado Pago, etc).

---

## Analytics and Metrics (MVP)

- Laundry and delivery history pages display metric cards at the top:
  - Total orders/deliveries
  - Revenue (laundry) / Earnings (delivery)
  - Average ratings received
- These cards facilitate performance tracking and are the basis for more advanced analytics in the future.

---

> Update this checklist as features are implemented.

---

## Recent Updates (Jul/2025)

- Code refactoring to remove unnecessary React imports in all `.tsx` files.
- Standardization of `useAuth` hook imports to use the correct context.
- Adjustment of type imports (`import type`) for compatibility with modern TypeScript.
- Removal of unused components (`CustomerHome`, `DeliveryHome`, `LaundryHome`) to avoid warnings and build errors.
- Installation and correct configuration of `react-router-dom` and its types.
- Correction of import paths in several files.
- Ensured all secrets needed for deploy (Vercel and Supabase) are configured in GitHub.
- Build and deploy checklist reviewed to ensure CI/CD pipeline success. 