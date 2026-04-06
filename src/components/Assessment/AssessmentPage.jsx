"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import jsPDF from "jspdf";

export default function AssessmentPage() {
  const { token } = useParams();

  const [student, setStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loadingNext, setLoadingNext] = useState(false);
  const [completed, setCompleted] = useState(false); // ✅ NEW
  const [errorMsg, setErrorMsg] = useState(""); // ✅ NEW

  const [report, setReport] = useState(null);
const [loadingReport, setLoadingReport] = useState(false);
  //  QUESTIONS FOR 10th
  const questions10 = [
    {
      question: "Which type of activities do you enjoy the most?",
      options: [
        "Solving logical problems",
        "Creative work",
        "Helping people",
        "Practical work",
      ],
    },
    // {
    //   question: "Which subject do you feel most confident in?",
    //   options: [
    //     "Mathematics",
    //     "Science",
    //     "Languages",
    //     "Social Studies",
    //   ],
    // },
  ];

  //  QUESTIONS FOR 12th
  const questions12 = [
    {
      question: "What is your primary career goal right now?",
      options: [
        "Engineering",
        "Medical",
        "Business",
        "Creative field",
      ],
    },
    // {
    //   question: "What matters most to you in a career?",
    //   options: [
    //     "High salary",
    //     "Passion",
    //     "Job security",
    //     "Work-life balance",
    //   ],
    // },
  ];

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await API.get(`/assessment/${token}`);

        setStudent(res.data);

        const studentClass = res.data.studentClass || res.data.class;

        if (studentClass === "10th") {
          setQuestions(questions10);
        } else if (studentClass === "12th") {
          setQuestions(questions12);
        }
      } catch (err) {
        console.log("❌ ERROR:", err);
      }
    };

    if (token) fetchAssessment();
  }, [token]);

  // ✅ HANDLE ANSWER
  const handleAnswer = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ]: option,
    }));
  };

  // 🔁 FUNCTION TO GET NEXT QUESTION WITH RETRY
  const fetchNextQuestion = async (retryCount = 0) => {
    try {
      const res = await API.post("/assessment/next-question", { token });

      // ✅ If backend says completed
      if (res.data.completed) {
        setCompleted(true);
        return;
      }

      //  Duplicate check (frontend safety)
      const isDuplicate = questions.some(
        (q) => q.question === res.data.question
      );

      if (isDuplicate && retryCount < 2) {
        console.log("🔁 Duplicate detected, retrying...");
        return fetchNextQuestion(retryCount + 1);
      }

      setQuestions((prev) => [...prev, res.data]);
      setCurrentQ((prev) => prev + 1);

    } catch (err) {
      const msg = err.response?.data?.message;

      // 🔁 HANDLE DUPLICATE ERROR FROM BACKEND
      if (msg === "Duplicate question generated, retrying..." && retryCount < 2) {
        console.log("🔁 Backend duplicate, retrying...");
        return fetchNextQuestion(retryCount + 1);
      }

      // ❌ FINAL FAILURE
      setErrorMsg("⚠️ Unable to generate next question. Please try again.");
    }
  };

  // ✅ NEXT BUTTON
  const handleNext = async () => {
    if (!answers[currentQ]) {
      alert("Select answer");
      return;
    }

    const currentQuestion = questions[currentQ];
    setLoadingNext(true);
    setErrorMsg("");

    try {
      // ✅ SAVE FIRST
      const saveRes = await API.post("/assessment/answer", {
        token,
        question: currentQuestion.question,
        options: currentQuestion.options,
        answer: answers[currentQ],
      });

      //  STOP AT 10
      if (saveRes.data.status === "completed") {
  setCompleted(true);

  try {
    setLoadingReport(true);
    const res = await API.post("/assessment/report", { token });
    setReport(res.data);
  } catch (err) {
    console.log("❌ REPORT ERROR:", err);
  } finally {
    setLoadingReport(false);
  }

  return;
}
      // ✅ GET NEXT QUESTION (WITH RETRY)
      await fetchNextQuestion();

    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);
      setErrorMsg("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoadingNext(false);
    }
  };

  // 🔄 INITIAL LOADING
  if (!questions.length || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading assessment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-[500px]">

        {/*  COMPLETED STATE */}
      {completed ? (
        <div>
          {loadingReport ? (
            <p className="text-center">Generating your report...</p>
          ) : report ? (
            <ProfessionalReport report={report} /> 
          ) : (
            <p className="text-red-500 text-center">
              Failed to generate report
            </p>
          )}
        </div>
      ) : (
          <>
            {/*  STUDENT INFO */}
            <h2 className="text-lg font-semibold text-center mb-1">
              Welcome, {student.studentName}
            </h2>

            <p className="text-sm text-gray-500 text-center mb-4">
              Class: {student.studentClass}
            </p>

            {/*  QUESTION COUNT */}
            <h3 className="text-md text-gray-600 mb-2 text-center">
              Question {currentQ + 1} / 10
            </h3>

            {/*  QUESTION */}
            <h2 className="text-xl font-bold mb-6 text-center">
              {questions[currentQ]?.question}
            </h2>

            {/*  OPTIONS */}
            <div className="space-y-3">
              {questions[currentQ]?.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={loadingNext}
                  className={`w-full text-left p-3 border rounded-lg transition 
                    ${
                      answers[currentQ] === opt
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }
                    ${loadingNext ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* ❌ ERROR MESSAGE */}
            {errorMsg && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {errorMsg}
              </p>
            )}

            {/*  NEXT BUTTON */}
            <button
              onClick={handleNext}
              disabled={loadingNext}
              className={`mt-6 w-full p-3 rounded-lg text-white 
                ${loadingNext ? "bg-gray-400" : "bg-blue-600"}
              `}
            >
              {loadingNext ? "Generating..." : "Next"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

function ProfessionalReport({ report }) {
  const [exit, setExit] = useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(18);
    doc.text("Career Assessment Report", 10, y);
    y += 10;

    const addSection = (title, data) => {
      doc.setFontSize(14);
      doc.text(title, 10, y);
      y += 6;

      doc.setFontSize(11);

      data.forEach((item) => {
        const lines = doc.splitTextToSize("• " + item, 180);
        doc.text(lines, 10, y);
        y += lines.length * 6;

        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });

      y += 5;
    };

    addSection("Career Suggestions", report.careerSuggestions);
    addSection("Strengths", report.strengths);
    addSection("Improvements", report.improvements);
    addSection("Skills to Learn", report.skillsToLearn);
    addSection("Roadmap", report.roadmap);

    doc.save("Career_Report.pdf");
  };

  if (exit) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          🎉 Congratulations!
        </h2>
        <p className="text-gray-600">
          Your assessment has been completed successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Career Assessment Report
        </h2>
        <p className="text-sm text-gray-500">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* SECTIONS */}
      {[
        { title: "🎯 Career Suggestions", data: report.careerSuggestions, color: "green" },
        { title: "💡 Strengths", data: report.strengths, color: "blue" },
        { title: "⚠️ Improvements", data: report.improvements, color: "red" },
        { title: "📚 Skills to Learn", data: report.skillsToLearn, color: "purple" },
        { title: "🚀 Roadmap", data: report.roadmap, color: "orange" },
      ].map((sec, i) => (
        <div key={i}>
          <h3 className={`font-semibold text-${sec.color}-600 mb-2`}>
            {sec.title}
          </h3>

          <div className="bg-gray-50 border rounded-lg p-3 space-y-1">
            {sec.data.map((item, j) => (
              <p key={j} className="text-gray-700">
                • {item}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* BUTTONS */}
      <div className="flex justify-center gap-4 pt-4 border-t">
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Download PDF
        </button>

        <button
          onClick={() => setExit(true)}
          className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400"
        >
          Exit
        </button>
      </div>

    </div>
  );
}