# Socket Notification Debugging Guide

## 🔍 How to Debug Socket Notifications

### Step 1: Check Browser Console

Open your browser DevTools (F12) → Console tab. After logging in, you should see:

```
🔌 Setting up socket for user: 2
🔌 Initializing socket connection to: http://localhost:5001
✅ Socket connected! ID: abc123xyz
✅ Socket connected for notifications, Socket ID: abc123xyz
📤 Emitting join-notify with userId: 2
```

**If you DON'T see these logs:**
- Socket is not connecting - check backend is running
- Check `NEXT_PUBLIC_API_URL` environment variable

**If socket keeps disconnecting:**
```
❌ Socket disconnected from notifications: transport close
❌ Socket connection error: xhr poll error
```
- Backend Socket.IO server is not running or crashed
- CORS issues preventing connection
- Wrong URL in environment variable

### Step 2: Verify Room Joining

After `join-notify` is emitted, check backend console for:
```
User 2 joined notification room
```

**If backend doesn't log this:**
- Backend is not listening for "join-notify" event
- Event name mismatch (frontend: "join-notify", backend: ???)

### Step 3: Trigger a Notification

When backend emits a notification, frontend console should show:
```
🔔 Socket event received: notification [{...}]
📩 New notification received via socket: {...}
📩 Notification details: {
  type: "donation",
  title: "New Donation",
  message: "Someone donated to your campaign",
  ...
}
```

**If you DON'T see these logs:**
- Backend is not emitting to the correct room
- Backend is not emitting "notification" event
- Room ID mismatch

### Step 4: Check Notification Structure

The backend must emit notifications with this structure:

```typescript
{
  type: "donation" | "volunteer" | "milestone" | "campaign" | "comment" | "system",
  title: string,
  message: string,
  actionUrl?: string,
  metadata?: any
}
```

**Common Backend Mistakes:**

❌ **Wrong room emission:**
```javascript
// Wrong - emits to specific socket
socket.emit('notification', data);

// Correct - emits to room
io.to(`notify-${userId}`).emit('notification', data);
```

❌ **Wrong event name:**
```javascript
// Wrong
io.to(`notify-${userId}`).emit('notify', data);

// Correct
io.to(`notify-${userId}`).emit('notification', data);
```

❌ **Missing required fields:**
```javascript
// Wrong - missing title/message
io.to(`notify-${userId}`).emit('notification', { amount: 100 });

// Correct
io.to(`notify-${userId}`).emit('notification', {
  type: 'donation',
  title: 'New Donation',
  message: 'You received a donation of $100',
  metadata: { amount: 100 }
});
```

## 🧪 Testing Socket Notifications

### Test 1: Manual Socket Test

Add this to your browser console after logging in:

```javascript
// Get the socket instance
const socket = window.__SOCKET__;

// Manually emit join-notify
socket.emit("join-notify", 2); // Replace 2 with your userId

// Listen for confirmation
socket.on("notification", (data) => {
  console.log("TEST: Received notification:", data);
});
```

### Test 2: Backend Manual Emit

In your backend, add a test route:

```javascript
app.get('/test/notification/:userId', (req, res) => {
  const userId = req.params.userId;

  io.to(`notify-${userId}`).emit('notification', {
    type: 'system',
    title: 'Test Notification',
    message: 'This is a test notification from backend',
    actionUrl: '/campaigns',
    metadata: { test: true }
  });

  res.json({ message: 'Notification sent' });
});
```

Then visit: `http://localhost:5001/test/notification/2`

### Test 3: Check Socket Rooms

In your backend, log the rooms when user joins:

```javascript
socket.on('join-notify', (userId) => {
  const roomName = `notify-${userId}`;
  socket.join(roomName);

  console.log(`User ${userId} joined room: ${roomName}`);
  console.log('All rooms:', Array.from(socket.rooms));
  console.log('Room members:', io.sockets.adapter.rooms.get(roomName));
});
```

## 🐛 Common Issues & Solutions

### Issue 1: "Socket connects but no notifications"

**Symptoms:**
- See "✅ Socket connected for notifications"
- See "📤 Emitting join-notify"
- But never see "📩 New notification received"

**Causes:**
1. Backend not emitting to the correct room
2. Room name mismatch (frontend: `notify-${userId}`, backend: something else)
3. Backend emitting before user joins room

**Solution:**
- Check backend room emission code
- Ensure room names match exactly
- Add delay or confirmation before emitting

### Issue 2: "Notification structure error"

**Symptoms:**
```
📩 New notification received via socket: {...}
📩 Notification details: { type: undefined, title: undefined, ... }
```

**Cause:** Backend sending wrong data structure

**Solution:**
```javascript
// Backend must send:
{
  type: 'donation',      // Required
  title: 'New Donation', // Required
  message: 'You received $100', // Required
  actionUrl: '/campaigns/123',  // Optional
  metadata: { amount: 100 }     // Optional
}
```

### Issue 3: "Multiple notifications for same event"

**Symptoms:**
- Same notification appears multiple times
- Console shows multiple "📩 New notification received"

**Causes:**
1. Multiple socket connections (component mounted multiple times)
2. Backend emitting to multiple rooms
3. Not cleaning up event listeners

**Solution:**
- Check component mounting (React Strict Mode?)
- Verify backend only emits once
- Ensure cleanup in useEffect return

### Issue 4: "Socket disconnects immediately"

**Symptoms:**
```
✅ Socket connected for notifications
❌ Socket disconnected from notifications: transport close
```

**Causes:**
1. Backend Socket.IO not configured properly
2. CORS issues
3. Wrong URL/port

**Solution:**
Check backend Socket.IO setup:
```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

## ✅ Checklist

Before asking for help, verify:

- [ ] Backend Socket.IO server is running
- [ ] Environment variable `NEXT_PUBLIC_API_URL` is correct
- [ ] Frontend logs show socket connection
- [ ] Frontend logs show "join-notify" emission
- [ ] Backend logs show user joined room
- [ ] Backend is emitting with correct event name: "notification"
- [ ] Backend is emitting to correct room: `notify-${userId}`
- [ ] Notification structure has `type`, `title`, `message` fields
- [ ] Browser console shows all socket events (🔔 logs)
- [ ] No CORS errors in console
- [ ] WiFi icon in notification dropdown is green

## 📞 Backend Requirements

Your backend MUST implement:

```javascript
// 1. Socket.IO initialization
const io = require('socket.io')(server, { /* CORS config */ });

// 2. Handle room joining
io.on('connection', (socket) => {
  socket.on('join-notify', (userId) => {
    const roomName = `notify-${userId}`;
    socket.join(roomName);
    console.log(`User ${userId} joined room: ${roomName}`);
  });
});

// 3. Emit notifications to rooms
function notifyUser(userId, notification) {
  io.to(`notify-${userId}`).emit('notification', {
    type: notification.type,
    title: notification.title,
    message: notification.message,
    actionUrl: notification.actionUrl,
    metadata: notification.metadata
  });
}

// 4. Example: Notify after payment
app.post('/payments/check', async (req, res) => {
  // ... verify payment ...

  if (paymentSuccessful) {
    // Save donation to database
    const donation = await saveDonation(paymentData);

    // Emit socket notification
    notifyUser(donation.userId, {
      type: 'donation',
      title: 'Payment Successful',
      message: `Your donation of $${donation.amount} was successful!`,
      actionUrl: `/campaigns/${donation.campaignId}`
    });

    // Also save to notifications table for GET /v1/notifications
    await saveNotificationToDB(donation.userId, notification);
  }

  res.json(paymentData);
});
```

## 🎯 Expected Console Output

**When everything works correctly:**

```
// On login:
🔌 Setting up socket for user: 2
🔌 Initializing socket connection to: http://localhost:5001
✅ Socket connected! ID: abc123xyz
✅ Socket connected for notifications, Socket ID: abc123xyz
📤 Emitting join-notify with userId: 2

// When notification arrives:
🔔 Socket event received: notification [{type: 'donation', title: '...'}]
📩 New notification received via socket: {type: 'donation', ...}
📩 Notification details: {
  type: "donation",
  title: "New Donation",
  message: "You received $100",
  actionUrl: "/campaigns/123",
  metadata: {amount: 100}
}

// Toast appears
// Notification bell count updates
// New notification in dropdown
```
