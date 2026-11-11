// Question Dataset for MT Onboarding Stacko Game
// Source: questions.md (45 Regular Questions + 8 Special Tower Fall Questions)

const QUESTIONS_DATA = {
  regular: [
    { number: 1, question: "If you could travel anywhere tomorrow, where would you go?" },
    { number: 2, question: "What's one thing people should know about you when working together?" },
    { number: 3, question: "What are you most excited about joining this Future Leadership Program?" },
    { number: 4, question: "What's your most random hidden talent?" },
    { number: 5, question: "Are you more of a planner or a spontaneous person?" },
    { number: 6, question: "What's one achievement you're secretly proud of?" },
    { number: 7, question: "If you could have dinner with any famous person, who would it be?" },
    { number: 8, question: "What kind of leader do you aspire to become?" },
    { number: 9, question: "What's your biggest pet peeve?" },
    { number: 10, question: "What's one thing you're passionate about outside of work?" },
    { number: 11, question: "If you could instantly master one skill, what would it be?" },
    { number: 12, question: "What do you hope to learn from your fellow participants?" },
    { number: 13, question: "What's your go-to comfort food?" },
    { number: 14, question: "What's one personal strength you can bring to this group?" },
    { number: 15, question: "If your life had a theme song, what would it be?" },
    { number: 16, question: "What's one experience that shaped who you are today?" },
    { number: 17, question: "Would you rather work independently or collaboratively? Why?" },
    { number: 18, question: "What's one thing on your bucket list?" },
    { number: 19, question: "What motivates you when things get difficult?" },
    { number: 20, question: "If you could switch lives with someone for a day, who would it be?" },
    { number: 21, question: "What's one thing you're looking forward to experiencing during this program?" },
    { number: 22, question: "What's your biggest green flag in a teammate?" },
    { number: 23, question: "If you could describe yourself in three words, what would they be?" },
    { number: 24, question: "What's one leadership quality you admire most?" },
    { number: 25, question: "Are you a morning person or a night owl?" },
    { number: 26, question: "What's one thing you'd like to improve about yourself?" },
    { number: 27, question: "If you could have any superpower, what would it be?" },
    { number: 28, question: "What does success mean to you beyond job titles and money?" },
    { number: 29, question: "What's one fun fact about yourself that people wouldn't expect?" },
    { number: 30, question: "How do you usually handle disagreements with others?" },
    { number: 31, question: "If you could give your younger self one piece of advice, what would it be?" },
    { number: 32, question: "What's one thing you hope to contribute to the Future Leadership Program?" },
    { number: 33, question: "What's the most spontaneous thing you've ever done?" },
    { number: 34, question: "Who has influenced your personal or professional growth the most?" },
    { number: 35, question: "If our group had a team name, what would you suggest?" },
    { number: 36, question: "What's one challenge you're excited to take on during this program?" },
    { number: 37, question: "Would you rather be the smartest person in the room or the most creative? Why?" },
    { number: 38, question: "What's one value you would never compromise?" },
    { number: 39, question: "If you could learn from any leader in the world, who would it be?" },
    { number: 40, question: "What's something you've always wanted to try but haven't had the chance to?" },
    { number: 41, question: "What do you think makes a team successful?" },
    { number: 42, question: "What's one thing that instantly puts you in a good mood?" },
    { number: 43, question: "What kind of impact do you want to make through your future career?" },
    { number: 44, question: "If you were given the opportunity to lead a project tomorrow, what would you do first?" },
    { number: 45, question: "Complete this sentence: \"By the end of this Future Leadership Program, I hope to…\"" }
  ],
  special: [
    { id: 1, code: "S1", question: "If our group were a company, what would our company name be?" },
    { id: 2, code: "S2", question: "Who in this group would most likely become a CEO? Why?" },
    { id: 3, code: "S3", question: "If we had to survive on a deserted island, what role would each person take?" },
    { id: 4, code: "S4", question: "Everyone gives one compliment to the person sitting next to them." },
    { id: 5, code: "S5", question: "What is one thing you think everyone in this group has in common?" },
    { id: 6, code: "S6", question: "Describe your group in one word!" },
    { id: 7, code: "S7", question: "Everyone shares one thing they hope to achieve together during this program." },
    { id: 8, code: "S8", question: "Create a team motto that represents your group." }
  ]
};

if (typeof window !== "undefined") {
  window.QUESTIONS_DATA = QUESTIONS_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = QUESTIONS_DATA;
}
