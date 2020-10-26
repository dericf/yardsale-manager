/* 
// A wizard that shows when its the first login for that user
//  - Add a flag in db.user (has_completed_onboarding=False)
//  - On log in, check if that flag is false, if it is, then navigate to the OnBoarding page
//  - Add an enum for current_onboarding_section(default=WELCOME)
//  - If the user clicks the "Skip" or "Hide" button, it sets that flag to True and navigates to /home

// Some Features:
    Do you want to include yourself (the user) as a seller?
        - checkbox
    Do you want to create a yardsale right away ? 
        - YES: open the new yardsale modal
        - NO: go to next section
    

*/