
import React, { useState } from 'react';
import { FaStar, FaComment, FaCalculator } from 'react-icons/fa';

interface EvaluationFormProps {
    template: any;
    staffMember: any;
    period: any;
}

interface EvaluationRating {
    criterionId: number;
    rating: number;
    comments: string;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ template, staffMember, period }) => {
    const [ratings, setRatings] = useState<EvaluationRating[]>([]);
    const [overallComments, setOverallComments] = useState('');

    const updateRating = (criterionId: number, rating: number) => {
        setRatings(prev => {
            const existing = prev.find(r => r.criterionId === criterionId);
            if (existing) {
                return prev.map(r => r.criterionId === criterionId ? { ...r, rating } : r);
            }
            return [...prev, { criterionId, rating, comments: '' }];
        });
    };

    const updateComments = (criterionId: number, comments: string) => {
        setRatings(prev => {
            const existing = prev.find(r => r.criterionId === criterionId);
            if (existing) {
                return prev.map(r => r.criterionId === criterionId ? { ...r, comments } : r);
            }
            return [...prev, { criterionId, rating: 0, comments }];
        });
    };

    const calculateOverallScore = () => {
        if (ratings.length === 0) return 0;
        
        const totalWeightedScore = template.criteria.reduce((sum: number, criterion: any) => {
            const rating = ratings.find(r => r.criterionId === criterion.id);
            return sum + (rating ? rating.rating * criterion.weight : 0);
        }, 0);
        
        const totalWeight = template.criteria.reduce((sum: number, criterion: any) => sum + criterion.weight, 0);
        return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    };

    const renderRatingScale = (criterion: any) => {
        const currentRating = ratings.find(r => r.criterionId === criterion.id)?.rating || 0;
        
        return (
            <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(value => (
                    <button
                        key={value}
                        onClick={() => updateRating(criterion.id, value)}
                        className={`p-2 rounded-md transition-colors ${
                            value <= currentRating 
                                ? 'bg-yellow-400 text-white' 
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                    >
                        <FaStar className="w-4 h-4" />
                    </button>
                ))}
                <span className="ml-3 font-medium text-gray-700">
                    {currentRating > 0 ? `${currentRating}/5` : 'Not Rated'}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Template Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">{template.name}</h3>
                <p className="text-sm text-blue-700">
                    Evaluation for: {staffMember.name} • Period: {period.name}
                </p>
            </div>

            {/* Criteria Evaluation */}
            <div className="space-y-6">
                {template.criteria.map((criterion: any) => (
                    <div key={criterion.id} className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Criterion Info */}
                            <div className="lg:col-span-1">
                                <h4 className="font-semibold text-gray-900 mb-2">{criterion.name}</h4>
                                <p className="text-sm text-gray-600 mb-3">{criterion.description}</p>
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        Weight: {criterion.weight}%
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                        {criterion.category}
                                    </span>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Rating
                                </label>
                                {renderRatingScale(criterion)}
                            </div>

                            {/* Comments */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    <FaComment className="inline w-4 h-4 mr-1" />
                                    Comments
                                </label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                                    rows={3}
                                    placeholder="Provide specific feedback and examples..."
                                    value={ratings.find(r => r.criterionId === criterion.id)?.comments || ''}
                                    onChange={(e) => updateComments(criterion.id, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Assessment */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Overall Score */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <FaCalculator className="text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Overall Performance Score</h3>
                        </div>
                        <div className="bg-white p-4 rounded-md border">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {calculateOverallScore().toFixed(1)}
                                </div>
                                <div className="text-sm text-gray-600">out of 5.0</div>
                                <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${(calculateOverallScore() / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overall Comments */}
                    <div>
                        <label className="block font-semibold text-gray-900 mb-3">
                            Overall Comments & Recommendations
                        </label>
                        <textarea
                            className="w-full p-4 border border-gray-300 rounded-md resize-none"
                            rows={5}
                            placeholder="Provide comprehensive feedback, highlighting key strengths, areas for improvement, and recommendations for professional development..."
                            value={overallComments}
                            onChange={(e) => setOverallComments(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Performance Level Indicator */}
            <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-4">Performance Level</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                        { range: '0-1', label: 'Needs Improvement', color: 'bg-red-500', textColor: 'text-red-700' },
                        { range: '1-2', label: 'Below Expectations', color: 'bg-orange-500', textColor: 'text-orange-700' },
                        { range: '2-3', label: 'Meets Expectations', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
                        { range: '3-4', label: 'Exceeds Expectations', color: 'bg-blue-500', textColor: 'text-blue-700' },
                        { range: '4-5', label: 'Outstanding', color: 'bg-green-500', textColor: 'text-green-700' }
                    ].map((level, index) => {
                        const score = calculateOverallScore();
                        const isActive = score >= index && score < (index + 1);
                        
                        return (
                            <div 
                                key={level.range}
                                className={`p-3 rounded-md text-center transition-all ${
                                    isActive 
                                        ? `${level.color} text-white shadow-lg` 
                                        : 'bg-gray-100 text-gray-500'
                                }`}
                            >
                                <div className="font-medium text-xs">{level.range}</div>
                                <div className="text-xs mt-1">{level.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EvaluationForm;