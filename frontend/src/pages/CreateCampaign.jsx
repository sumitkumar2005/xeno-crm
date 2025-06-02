// 📄 CreateCampaign.jsx (With AI Message Suggestions Modal)

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ruleFields = ["spend", "visits", "inactive_days"];
const operators = [">", "<", ">=", "<=", "=="];

export default function CreateCampaign() {
    const navigate = useNavigate();
    const [rules, setRules] = useState([
        { field: "", operator: "", value: "", logical: "AND" },
    ]);
    const [message, setMessage] = useState("Hi {{name}}, get 20% off this week!");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [aiLoading, setAiLoading] = useState(false);

    // New states for suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const addRule = () => {
        setRules([...rules, { field: "", operator: "", value: "", logical: "AND" }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...rules];
        updated[index][field] = value;
        setRules(updated);
        if (errors[`rule-${index}-${field}`]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[`rule-${index}-${field}`];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!message.trim()) newErrors.message = "Campaign message is required";

        const validRules = rules.filter(rule => rule.field && rule.operator && rule.value.trim());
        if (validRules.length === 0) newErrors.general = "At least one complete rule is required";

        rules.forEach((rule, index) => {
            if (rule.field || rule.operator || rule.value.trim()) {
                if (!rule.field) newErrors[`rule-${index}-field`] = "Field is required";
                if (!rule.operator) newErrors[`rule-${index}-operator`] = "Operator is required";
                if (!rule.value.trim()) newErrors[`rule-${index}-value`] = "Value is required";
                if (["spend", "visits", "inactive_days"].includes(rule.field) && isNaN(Number(rule.value))) {
                    newErrors[`rule-${index}-value`] = "Value must be a number";
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem("token");
            const validRules = rules.filter(rule => rule.field && rule.operator && rule.value.trim());
            const payload = {
                rules: validRules.map(rule => ({
                    field: rule.field,
                    operator: rule.operator,
                    value: rule.value,
                    logical: rule.logical || "AND",
                })),
                message: message.trim(),
            };

            const res = await axios.post("http://localhost:5000/api/campaigns", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating campaign:", err);
            const errorMessage =
                err.response?.data?.message ||
                (err.response?.status === 401 ? "Authentication failed. Please login again." :
                    err.response?.status === 400 ? "Invalid campaign data." :
                        "Server error. Please try again later.");
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleGetSuggestions = async () => {
        setAiLoading(true);
        try {
            const token = localStorage.getItem("token");
            const validRules = rules.filter(rule => rule.field && rule.operator && rule.value.trim());

            const res = await axios.post("http://localhost:5000/api/ai/get-suggestions", { rules: validRules }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data?.suggestions && res.data.suggestions.length > 0) {
                setSuggestions(res.data.suggestions);
                setShowSuggestions(true);
            } else {
                alert("AI did not return suggestions.");
            }
        } catch (err) {
            console.error("AI suggestions failed:", err);
            alert("Failed to get suggestions from AI.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleSelectSuggestion = (selectedMessage) => {
        setMessage(selectedMessage);
        setShowSuggestions(false);
    };

    const closeSuggestions = () => {
        setShowSuggestions(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Create New Campaign</h1>

                {/* Get Suggestions Button */}
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={handleGetSuggestions}
                        disabled={aiLoading}
                        className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all"
                    >
                        {aiLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Getting Suggestions...
                            </>
                        ) : (
                            <>💡 Get AI Suggestions</>
                        )}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rules Section */}
                    {rules.map((rule, index) => (
                        <div key={index} className="flex gap-3">
                            <select
                                className="border p-2 rounded"
                                value={rule.field}
                                onChange={(e) => handleChange(index, "field", e.target.value)}
                            >
                                <option value="">Field</option>
                                {ruleFields.map((f) => <option key={f}>{f}</option>)}
                            </select>
                            <select
                                className="border p-2 rounded"
                                value={rule.operator}
                                onChange={(e) => handleChange(index, "operator", e.target.value)}
                            >
                                <option value="">Operator</option>
                                {operators.map((op) => <option key={op}>{op}</option>)}
                            </select>
                            <input
                                type="text"
                                className="border p-2 rounded"
                                placeholder="Value"
                                value={rule.value}
                                onChange={(e) => handleChange(index, "value", e.target.value)}
                            />
                        </div>
                    ))}

                    <button type="button" onClick={addRule} className="bg-indigo-600 text-white px-4 py-2 rounded">
                        + Add Rule
                    </button>

                    {/* Message Box */}
                    <div>
                        <label className="font-semibold block mb-1">Campaign Message</label>
                        <textarea
                            className="w-full border p-3 rounded"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        {loading ? "Submitting..." : "Submit Campaign"}
                    </button>
                </form>

                {/* Suggestions Modal */}
                {showSuggestions && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">AI Message Suggestions</h3>
                                <button
                                    onClick={closeSuggestions}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">Choose a message that fits your campaign:</p>

                            <div className="space-y-4">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all"
                                        onClick={() => handleSelectSuggestion(suggestion)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="text-gray-800 flex-1 mr-4">{suggestion}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectSuggestion(suggestion);
                                                }}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium"
                                            >
                                                Use This
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={closeSuggestions}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}