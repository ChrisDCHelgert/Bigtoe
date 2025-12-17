# Support Data Schema

**Version:** 1.0
**Database:** Firestore

---

## 1. Collections

### `tickets` (Collection)
*   **Doc ID:** `ticketId` (Auto-ID)
*   **Fields:**
    *   `userId`: string (uid)
    *   `category`: 'billing' | 'technical' | 'policy' | 'account'
    *   `subject`: string
    *   `description`: string (Sanitized)
    *   `status`: 'open' | 'pending_user' | 'resolved' | 'closed'
    *   `priority`: 'low' | 'normal' | 'high'
    *   `createdAt`: Timestamp
    *   `updatedAt`: Timestamp
    *   `messages`: Subcollection OR Array of Maps
        *   `sender`: 'user' | 'support'
        *   `text`: string
        *   `timestamp`: Timestamp

### `moderation_flags` (Collection)
*   **Doc ID:** Auto-ID
*   **Fields:**
    *   `reporterId`: string (uid)
    *   `targetId`: string (assetId)
    *   `reason`: 'illegal' | 'minor' | 'non_consensual' | 'glitch'
    *   `status`: 'open' | 'reviewed' | 'dismissed'
    *   `outcome`: 'asset_deleted' | 'user_banned' | 'no_action'
    *   `timestamp`: Timestamp

---

## 2. Security Rules (Concept)

```javascript
match /tickets/{ticketId} {
  // Create: Auth Only + Validation
  allow create: if request.auth != null 
                && request.resource.data.userId == request.auth.uid
                && validateText(request.resource.data.description);
                
  // Read: Owner or Support Staff
  allow read: if request.auth.uid == resource.data.userId || hasRole('moderator');
  
  // Update: Owner can append messages (via function or subcollection rules)
  allow update: if false; // Prefer cloud functions for message appending
}
```

---

## 3. Interfaces

**`openTicket(params: TicketParams): Promise<string>`**
*   Validates input.
*   Creates doc.
*   Triggers "Ticket Created" email (optional).

**`reportContent(targetId: string, reason: string): Promise<void>`**
*   Creates flag.
*   Updates UI to hide content locally.
