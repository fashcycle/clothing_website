import React, { useState, useEffect } from "react";
import { Trash2, X, Hash } from "lucide-react";
import { Formik, Form, Field } from "formik";
import { Loader } from "@/components/ui/loader";
import { createFittings, deleteFitting, getAllFittings } from "@/app/api/api";

interface Fitting {
    id: string;
    userId: string;
    fittingData: {
        blouse?: {
            bust?: string;
            waist?: string;
            shoulder?: string;
            armhole?: string;
            sleeveLength?: string;
            sleeveRound?: string;
        };
        lehenga?: {
            waist?: string;
            length?: string;
        };
    };
    recordStatus: string;
    createdAt: string;
    updatedAt: string;
}

interface FittingsDialogProps {
    onClose: () => void;
}

const FittingsDialog: React.FC<FittingsDialogProps> = ({ onClose }) => {
    const [fittings, setFittings] = useState<Fitting[]>([]);
    const [activeTab, setActiveTab] = useState<"list" | "create">("list");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<{ totalPages: number; page: number }>({ totalPages: 1, page: 1 });
    const [isLoading, setIsLoading] = useState(false);

    const [limit] = useState(5);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getAllFittings(page, limit);
            setFittings(res.fittings || []);
            if (res.pagination) {
                setPagination({ totalPages: res.pagination.totalPages, page: res.pagination.page });
            }
        } catch (err) {
            console.error("❌ Failed to fetch fittings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleDeleteFitting = async (id: string) => {
        try {
            await deleteFitting(id);
            console.log("✅ Fitting deleted successfully");
            await fetchData();
        } catch (err) {
            console.error("❌ Failed to delete fitting:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Tabs */}
                <div className="flex border-b mb-4">
                    <button
                        className={`flex-1 py-2 text-center font-medium ${activeTab === "list"
                            ? "border-b-2 border-[#1b3226] text-[#1b3226]"
                            : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("list")}
                    >
                        Fittings List
                    </button>
                    <button
                        className={`flex-1 py-2 text-center font-medium ${activeTab === "create"
                            ? "border-b-2 border-[#1b3226] text-[#1b3226]"
                            : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("create")}
                    >
                        Create New Fitting
                    </button>
                </div>

                {/* Fittings List */}
                {activeTab === "list" && (
                    <div className="flex flex-col h-[400px]">
                        {/* Scrollable fittings list */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {isLoading ? (
                                <div className="flex justify-center align-center py-8">
                                    <Loader text="Loading Fittings..." />
                                </div>
                            ) : fittings?.length > 0 ? (
                                fittings.map((fitting, index) => (

                                    <div className="relative border border-gray-200 p-3 rounded-lg shadow-md bg-white hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group">
                                        {/* Icon */}
                                        <div className="absolute top-2 left-2 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200">
                                            <Hash className="w-3 h-3" />
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteFitting(fitting.id)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"      >
                                            <Trash2 className="w-3 h-3" />
                                        </button>

                                        {/* Fitting Sections */}
                                        <div className="ml-5 space-y-2">
                                            {/* Blouse Section */}
                                            {fitting.fittingData.blouse && (
                                                <div className="animate-in fade-in duration-300">
                                                    <p className="font-medium text-emerald-700 text-xs mb-1">Blouse</p>
                                                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                                                        {Object.entries(fitting.fittingData.blouse).map(([key, value]) => (
                                                            <div key={key} className="flex gap-1">
                                                                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                                                                <span className="text-gray-800">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Lehenga Section */}
                                            {fitting.fittingData.lehenga && (
                                                <div className="animate-in fade-in duration-300 delay-100">
                                                    <p className="font-medium text-emerald-700 text-xs mb-1">Lehenga</p>
                                                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                                                        {Object.entries(fitting.fittingData.lehenga).map(([key, value]) => (
                                                            <div key={key} className="flex gap-1">
                                                                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                                                                <span className="text-gray-800">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <p className="text-gray-500 mb-4">No fittings found</p>
                                    <button
                                        onClick={() => setActiveTab("create")}
                                        className="px-4 py-2 bg-[#1b3226] text-white rounded hover:bg-[#1b3226]"
                                    >
                                        Create New Fitting
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pagination fixed at bottom */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                )}


                {activeTab === "create" && (
                    <Formik
                        initialValues={{
                            blouse: {
                                bust: "",
                                waist: "",
                                shoulder: "",
                                armhole: "",
                                sleeveLength: "",
                                sleeveRound: "",
                            },
                            lehenga: {
                                waist: "",
                                length: "",
                            },
                        }}
                        onSubmit={async (values, { resetForm }) => {
                            const allFields = [
                                ...Object.values(values.blouse || {}),
                                ...Object.values(values.lehenga || {}),
                            ];

                            const hasData = allFields.some((val) => val && val.trim() !== "");

                            if (!hasData) {
                                console.warn("⚠️ Skipping API call: All fields are empty");
                                return;
                            }

                            const payload = {
                                fittingData: values,
                            };

                            try {
                                const response = await createFittings(payload);
                                console.log("✅ Fitting created:", response);

                                await fetchData();

                                resetForm();
                                setActiveTab("list");
                            } catch (error) {
                                console.error("❌ Failed to create fitting:", error);
                            }
                        }}

                    >
                        {({ isSubmitting }) => (
                            <Form className="mt-2 space-y-4">
                                <h4 className="font-semibold text-green-800">Blouse</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium">Bust</label>
                                        <Field
                                            name="blouse.bust"
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter bust in cms or inches"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Waist</label>
                                        <Field
                                            name="blouse.waist"
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter waist in cms or inches"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Shoulder</label>
                                        <Field
                                            name="blouse.shoulder"
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter shoulder in cms or inches"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Armhole</label>
                                        <Field
                                            name="blouse.armhole"
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter armhole in cms or inches"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Sleeve Length</label>
                                        <Field
                                            name="blouse.sleeveLength"
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter sleeve length in cms or inches"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Sleeve Round</label>
                                        <Field
                                            name="blouse.sleeveRound"
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter sleeve round in cms or inches"
                                        />
                                    </div>
                                </div>

                                <h4 className="font-semibold text-green-800 mt-4">Lehenga</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium">Waist</label>
                                        <Field
                                            name="lehenga.waist"
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter waist in cms or inches"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Length</label>
                                        <Field
                                            name="lehenga.length"
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter length in cms or inches"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 px-4 py-2 rounded text-white ${isSubmitting
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#1b3226] hover:bg-[#1b3226]"
                                            }`}
                                    >
                                        {isSubmitting ? "Saving..." : "Save Fitting"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("list")}
                                        disabled={isSubmitting} // also disable cancel during saving
                                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default FittingsDialog;
