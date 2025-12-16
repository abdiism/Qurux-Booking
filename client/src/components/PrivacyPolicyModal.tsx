import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Eye } from 'lucide-react';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Shield size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-stone-900">Privacy Policy</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                            <X size={20} className="text-stone-500" />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <div className="prose prose-stone max-w-none">
                            <p className="text-stone-500 mb-6">Last updated: December 14, 2025</p>

                            <h3 className="text-lg font-bold text-stone-900 mb-3">1. Introduction</h3>
                            <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                                Welcome to Qurux. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our application and tell you about your privacy rights and how the law protects you.
                            </p>

                            <h3 className="text-lg font-bold text-stone-900 mb-3">2. Data We Collect</h3>
                            <p className="text-stone-600 mb-4 text-sm leading-relaxed">
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-stone-600 mb-6">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of services you have purchased from us.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                            </ul>

                            <h3 className="text-lg font-bold text-stone-900 mb-3">3. How We Use Your Data</h3>
                            <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-stone-50 p-4 rounded-xl">
                                    <Lock size={20} className="text-rose-500 mb-2" />
                                    <h4 className="font-bold text-stone-800 text-sm mb-1">Security</h4>
                                    <p className="text-xs text-stone-500">To protect your account and prevent fraud.</p>
                                </div>
                                <div className="bg-stone-50 p-4 rounded-xl">
                                    <Eye size={20} className="text-blue-500 mb-2" />
                                    <h4 className="font-bold text-stone-800 text-sm mb-1">Improvement</h4>
                                    <p className="text-xs text-stone-500">To improve our website, products/services, marketing, and customer relationships.</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-stone-900 mb-3">4. Data Security</h3>
                            <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>

                            <h3 className="text-lg font-bold text-stone-900 mb-3">5. Contact Us</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                If you have any questions about this privacy policy or our privacy practices, please contact us at: <span className="text-rose-500 font-bold">privacy@qurux.so</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
