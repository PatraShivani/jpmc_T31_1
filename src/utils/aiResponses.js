// Knowledge base for the AI assistant
const knowledgeBase = {
  // Common questions for all users
  common: {
    greeting: [
      "hello", "hi", "hey", "good morning", "good afternoon", "good evening"
    ],
    attendance: [
      "attendance", "mark attendance", "take attendance", "record attendance", "attendance marking"
    ],
    families: [
      "family", "families", "add family", "manage family", "family management"
    ],
    students: [
      "student", "students", "student management", "track students"
    ],
    women: [
      "women", "women skills", "women empowerment", "skill training"
    ],
    navigation: [
      "navigate", "how to use", "dashboard", "menu", "sidebar"
    ],
    help: [
      "help", "support", "assistance", "guide", "tutorial"
    ]
  },
  
  // Admin-specific questions
  admin: {
    analytics: [
      "analytics", "reports", "statistics", "data export", "performance metrics"
    ],
    management: [
      "manage users", "user management", "admin panel", "system settings"
    ]
  },
  
  // Tutor-specific questions
  tutor: {
    limited: [
      "what can I do", "my permissions", "tutor access", "available features"
    ]
  }
};

// Response templates
const responses = {
  greeting: {
    common: "Hello! I'm your KALAMS assistant. I'm here to help you navigate and use the dashboard effectively. What would you like to know about?"
  },
  
  attendance: {
    common: `📋 **How to Mark Attendance:**

1. **Navigate to Students page** from the sidebar
2. **Click "Take Attendance"** button (top right)
3. **Select the date** (defaults to today)
4. **Mark each student** as Present ✅ or Absent ❌
5. **Click "Save Attendance"** to record

💡 **Tips:**
- You can view attendance history for each student
- Attendance percentages are automatically calculated
- Use filters to find specific students quickly`,
    
    admin: `📋 **Attendance Management (Admin):**

**For Students:**
1. Go to Students → Take Attendance
2. Select date and mark attendance
3. View attendance reports in Analytics

**Monitoring:**
- Check attendance trends in Admin Dashboard
- Export attendance data for reports
- Monitor center-wise attendance rates

💡 **Admin Tip:** Use the Analytics page to track attendance patterns across all centers.`,
    
    tutor: `📋 **Taking Attendance (Tutor):**

1. **Go to Students page** from sidebar
2. **Click "Take Attendance"** 
3. **Select today's date**
4. **Mark each student** present/absent
5. **Save the attendance**

Note: As a tutor, you can mark attendance and view student progress, but cannot access admin analytics.`
  },
  
  families: {
    common: `👨‍👩‍👧‍👦 **Family Management:**

**Adding a New Family:**
1. Go to **Families page**
2. Click **"Add Family"** button
3. Fill in family details:
   - Family name
   - Contact information
   - Center location
   - Family members
4. Click **"Save"**

**Managing Families:**
- View all families in card format
- Filter by center location
- Track family member progress
- Update contact information`,
    
    admin: `👨‍👩‍👧‍👦 **Family Management (Admin):**

**Full Access:**
- Add/edit/delete families
- View all centers' families
- Export family data
- Track family growth metrics

**Analytics:**
- Monitor family enrollment trends
- Center-wise family distribution
- Family member progress tracking

💡 **Admin Features:** Access comprehensive family analytics in the Admin Dashboard.`,
    
    tutor: `👨‍👩‍👧‍👦 **Family Management (Tutor):**

**Your Access:**
- View and add families
- Update family information
- Track member progress
- Manage family contacts

Note: You have full family management access but cannot delete families or access admin-level analytics.`
  },
  
  students: {
    common: `🎓 **Student Management:**

**Key Features:**
- **Attendance Tracking:** Mark daily attendance
- **Test Scores:** Record and track academic performance
- **Progress Monitoring:** View student development
- **Performance Metrics:** Attendance % and test averages

**Quick Actions:**
1. **View Students:** See all enrolled students
2. **Take Attendance:** Daily attendance marking
3. **Record Scores:** Update test results
4. **Track Progress:** Monitor individual performance`,
    
    admin: `🎓 **Student Management (Admin):**

**Complete Access:**
- Manage all students across centers
- View comprehensive analytics
- Export student data
- Monitor performance trends

**Analytics Features:**
- Average test scores across centers
- Attendance rate analysis
- Student progress tracking
- Performance comparisons

💡 **Pro Tip:** Use the Admin Dashboard for center-wise student performance analysis.`,
    
    tutor: `🎓 **Student Management (Tutor):**

**Your Capabilities:**
- Mark student attendance
- Record test scores
- View student progress
- Track individual performance

**Daily Tasks:**
1. Take attendance each day
2. Update test scores when available
3. Monitor student progress
4. Support student development

Note: You can manage students but cannot access system-wide analytics.`
  },
  
  women: {
    common: `💪 **Women Skills Empowerment:**

**Program Management:**
- **Skill Training:** Track various skill programs
- **Employment Status:** Monitor job placements
- **Progress Tracking:** Record training completion
- **Skills Categories:** Tailoring, Computer Skills, Handicrafts, etc.

**Key Actions:**
1. **Add Women:** Register new participants
2. **Update Skills:** Record training progress
3. **Track Employment:** Monitor job status
4. **View Progress:** Check completion rates`,
    
    admin: `💪 **Women Empowerment (Admin):**

**Full Management:**
- Oversee all skill programs
- Track employment rates
- Monitor training completion
- Export empowerment data

**Analytics:**
- Women employment statistics
- Skill completion rates
- Center-wise performance
- Impact measurement

💡 **Impact Tracking:** View comprehensive women empowerment metrics in Admin Dashboard.`,
    
    tutor: `💪 **Women Skills (Tutor):**

**Your Role:**
- Register new women participants
- Update training progress
- Track skill development
- Monitor employment status

**Daily Tasks:**
- Record training attendance
- Update skill completion status
- Support women in their journey
- Track job placement success

Note: You can manage women's programs but cannot access admin-level impact analytics.`
  },
  
  navigation: {
    common: `🧭 **Dashboard Navigation:**

**Sidebar Menu:**
- **Dashboard:** Overview and key metrics
- **Families:** Manage family information
- **Students:** Student tracking and attendance
- **Women Skills:** Empowerment programs

**Quick Tips:**
- Use the search/filter options on each page
- Click on cards for detailed information
- Look for action buttons (Add, Edit, etc.)
- Check the top-right for page-specific actions`,
    
    admin: `🧭 **Admin Navigation:**

**Your Menu:**
- **Dashboard:** Quick overview
- **Families:** Family management
- **Students:** Student tracking
- **Women Skills:** Empowerment programs
- **Analytics:** Comprehensive admin dashboard

**Admin Features:**
- Export data from any page
- Access all centers' information
- View system-wide analytics
- Manage all user data`,
    
    tutor: `🧭 **Tutor Navigation:**

**Your Menu:**
- **Families:** Manage families
- **Students:** Track students and attendance
- **Women Skills:** Empowerment programs

**Note:** As a tutor, you have access to core management features but not admin analytics or system settings.`
  },
  
  analytics: {
    admin: `📊 **Analytics & Reports (Admin Only):**

**Admin Dashboard Features:**
- **Key Metrics:** Total families, students, women
- **Performance Overview:** Attendance rates, test scores
- **Center Breakdown:** Performance by location
- **Trends:** Monthly progress tracking
- **Export:** Download data as CSV

**How to Access:**
1. Click **"Analytics"** in sidebar
2. Select time period (week/month/quarter/year)
3. View comprehensive metrics
4. Use **"Export Data"** for reports

💡 **Pro Tip:** Use filters to analyze specific centers or time periods.`
  },
  
  permissions: {
    tutor: `🔐 **Your Tutor Permissions:**

**What You Can Do:**
✅ Manage families and their information
✅ Track students and mark attendance
✅ Record test scores and progress
✅ Manage women's skill programs
✅ View individual progress metrics

**What You Cannot Do:**
❌ Access admin analytics dashboard
❌ Export system-wide data
❌ Delete families or students
❌ Access system settings
❌ View cross-center analytics

Your role focuses on direct program management and participant tracking.`
  },
  
  help: {
    common: `🆘 **Need More Help?**

**Common Questions:**
- "How to mark attendance"
- "How to add a family"
- "How to record test scores"
- "How to update women's training status"
- "How to navigate the dashboard"

**Quick Tips:**
- Look for **"Add"** buttons to create new records
- Use **filters** to find specific information
- Check **tooltips** by hovering over icons
- Most actions have **confirmation dialogs**

**Still Need Help?**
Ask me specific questions like:
- "How do I add a new student?"
- "Where can I see attendance reports?"
- "How to update family contact info?"`
  },
  
  fallback: {
    common: `I'm not sure about that specific question, but I can help you with:

📋 **Attendance:** How to mark and track attendance
👨‍👩‍👧‍👦 **Families:** Managing family information
🎓 **Students:** Student tracking and performance
💪 **Women Skills:** Empowerment program management
🧭 **Navigation:** How to use the dashboard

Try asking something like:
- "How do I mark attendance?"
- "How to add a new family?"
- "Where can I see student progress?"

What specific task would you like help with?`
  }
};

// Function to find the best matching response
export const getAIResponse = async (userInput, userRole = 'tutor') => {
  const input = userInput.toLowerCase();
  
  // Check for greeting
  if (knowledgeBase.common.greeting.some(keyword => input.includes(keyword))) {
    return responses.greeting.common;
  }
  
  // Check for attendance questions
  if (knowledgeBase.common.attendance.some(keyword => input.includes(keyword))) {
    return responses.attendance[userRole] || responses.attendance.common;
  }
  
  // Check for family questions
  if (knowledgeBase.common.families.some(keyword => input.includes(keyword))) {
    return responses.families[userRole] || responses.families.common;
  }
  
  // Check for student questions
  if (knowledgeBase.common.students.some(keyword => input.includes(keyword))) {
    return responses.students[userRole] || responses.students.common;
  }
  
  // Check for women empowerment questions
  if (knowledgeBase.common.women.some(keyword => input.includes(keyword))) {
    return responses.women[userRole] || responses.women.common;
  }
  
  // Check for navigation questions
  if (knowledgeBase.common.navigation.some(keyword => input.includes(keyword))) {
    return responses.navigation[userRole] || responses.navigation.common;
  }
  
  // Check for help questions
  if (knowledgeBase.common.help.some(keyword => input.includes(keyword))) {
    return responses.help.common;
  }
  
  // Admin-specific questions
  if (userRole === 'admin') {
    if (knowledgeBase.admin.analytics.some(keyword => input.includes(keyword))) {
      return responses.analytics.admin;
    }
  }
  
  // Tutor-specific questions
  if (userRole === 'tutor') {
    if (knowledgeBase.tutor.limited.some(keyword => input.includes(keyword))) {
      return responses.permissions.tutor;
    }
  }
  
  // Fallback response
  return responses.fallback.common;
};
