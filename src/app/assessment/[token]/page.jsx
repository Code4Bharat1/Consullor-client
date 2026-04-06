// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import API from "../../../utils/api";

// export default function AssessmentPage() {
//   const { token } = useParams();

//   const [student, setStudent] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [currentQ, setCurrentQ] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [loadingNext, setLoadingNext] = useState(false);

//   // 🔥 QUESTIONS FOR 10th
//   const questions10 = [
//     {
//       question: "Which type of activities do you enjoy the most?",
//       options: [
//         "Solving logical problems",
//         "Creative work",
//         "Helping people",
//         "Practical work",
//       ],
//     },
//     {
//       question: "Which subject do you feel most confident in?",
//       options: [
//         "Mathematics",
//         "Science",
//         "Languages",
//         "Social Studies",
//       ],
//     },
//   ];

//   // 🔥 QUESTIONS FOR 12th
//   const questions12 = [
//     {
//       question: "What is your primary career goal right now?",
//       options: [
//         "Engineering",
//         "Medical",
//         "Business",
//         "Creative field",
//       ],
//     },
//     {
//       question: "What matters most to you in a career?",
//       options: [
//         "High salary",
//         "Passion",
//         "Job security",
//         "Work-life balance",
//       ],
//     },
//   ];

//   // ✅ FETCH DATA
//   useEffect(() => {
//     const fetchAssessment = async () => {
//       try {
//         const res = await API.get(`/assessment/${token}`);

//         setStudent(res.data);

//         const studentClass = res.data.studentClass || res.data.class;

//         if (studentClass === "10th") {
//           setQuestions(questions10);
//         } else if (studentClass === "12th") {
//           setQuestions(questions12);
//         }
//       } catch (err) {
//         console.log("❌ ERROR:", err);
//       }
//     };

//     if (token) fetchAssessment();
//   }, [token]);

//   // ✅ HANDLE ANSWER
//   const handleAnswer = (option) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [currentQ]: option,
//     }));
//   };

//   // ✅ NEXT
//   const handleNext = async () => {
//     if (!answers[currentQ]) {
//       alert("Select answer");
//       return;
//     }

//     const currentQuestion = questions[currentQ];
//     setLoadingNext(true);

//     try {
//       const savePromise = API.post("/assessment/answer", {
//         token,
//         question: currentQuestion.question,
//         options: currentQuestion.options,
//         answer: answers[currentQ],
//       });

//       const nextQPromise = API.post("/assessment/next-question", { token });

//       const res = await nextQPromise;

//       if (res.data.completed) {
//         alert("Assessment Completed");
//         return;
//       }

//       setQuestions((prev) => [...prev, res.data]);
//       setCurrentQ((prev) => prev + 1);

//       await savePromise;

//     } catch (err) {
//       console.log("❌ ERROR:", err.response?.data || err.message);
//       alert("Something went wrong");
//     } finally {
//       setLoadingNext(false);
//     }
//   };

//   // 🔄 INITIAL LOADING
//   if (!questions.length || !student) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading assessment...</p>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQ];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
//       <div className="bg-white p-8 rounded-xl shadow-lg w-[500px]">

//         {/* 🔥 STUDENT INFO */}
//         <h2 className="text-lg font-semibold text-center mb-1">
//           Welcome, {student.studentName}
//         </h2>

//         <p className="text-sm text-gray-500 text-center mb-4">
//           Class: {student.studentClass}
//         </p>

//         {/* 🔥 QUESTION COUNT */}
//         <h3 className="text-md text-gray-600 mb-2 text-center">
//           Question {currentQ + 1}
//         </h3>

//         {/* 🔥 QUESTION */}
//         <h2 className="text-xl font-bold mb-6 text-center">
//           {currentQuestion?.question || "Loading next question..."}
//         </h2>

//         {/* 🔥 OPTIONS */}
//         <div className="space-y-3">
//           {currentQuestion?.options?.map((opt, i) => (
//             <button
//               key={i}
//               onClick={() => handleAnswer(opt)}
//               disabled={loadingNext}
//               className={`w-full text-left p-3 border rounded-lg transition 
//                 ${
//                   answers[currentQ] === opt
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-gray-100"
//                 }
//                 ${loadingNext ? "opacity-50 cursor-not-allowed" : ""}
//               `}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>

//         {/* 🔥 NEXT BUTTON */}
//         <button
//           onClick={handleNext}
//           disabled={loadingNext || !currentQuestion}
//           className={`mt-6 w-full p-3 rounded-lg text-white 
//             ${loadingNext ? "bg-gray-400" : "bg-blue-600"}
//           `}
//         >
//           {loadingNext ? "Generating..." : "Next"}
//         </button>

//       </div>
//     </div>
//   );
// }

import AssessmentPage from "@/components/Assessment/AssessmentPage";
import React from 'react'

const page = () => {
  return (
    <div>
      <AssessmentPage/>
    </div>
  )
}

export default page
