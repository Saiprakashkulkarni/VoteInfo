export const electionDatasets = {
  turnout: [
    { year: 2004, turnout: 58.1, totalVoters: "671M" },
    { year: 2009, turnout: 58.2, totalVoters: "716M" },
    { year: 2014, turnout: 66.4, totalVoters: "834M" },
    { year: 2019, turnout: 67.4, totalVoters: "912M" },
    { year: 2024, turnout: 66.3, totalVoters: "969M" }
  ],
  demographics: [
    { ageGroup: "18-25", percentage: 15, registered: "145M", color: "#818cf8" },
    { ageGroup: "26-40", percentage: 35, registered: "339M", color: "#6366f1" },
    { ageGroup: "41-60", percentage: 30, registered: "290M", color: "#4f46e5" },
    { ageGroup: "60+", percentage: 20, registered: "195M", color: "#3730a3" }
  ],
  genderTurnout: [
    { year: 2014, male: 67.1, female: 65.6 },
    { year: 2019, male: 67.0, female: 67.2 },
    { year: 2024, male: 65.8, female: 66.7 }
  ],
  constituencyStats: {
    total: 543,
    avgCandidatesPerSeat: 15,
    statesWithHighestTurnout: ["Lakshadweep", "Tripura", "Nagaland"],
    votingMethods: ["EVM", "VVPAT", "Postal Ballot (Senior Citizens/PWD)"]
  }
};

export const sampleQuestions = [
  "How has voter turnout changed over the last 5 elections?",
  "Analyze the gender gap in voting trends.",
  "Which age group has the highest number of registered voters?",
  "Tell me about the 2024 election demographics.",
  "What are the different voting methods used?"
];
