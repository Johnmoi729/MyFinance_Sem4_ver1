import React, { useState, useEffect } from 'react';
import { AlertCircle, Wrench } from '../../components/icons';

const MaintenanceModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [maintenanceInfo, setMaintenanceInfo] = useState({
        message: 'Hệ thống đang bảo trì. Vui lòng quay lại sau.',
        timestamp: Date.now()
    });

    useEffect(() => {
        const handleMaintenanceMode = (event) => {
            setMaintenanceInfo({
                message: event.detail.message || 'Hệ thống đang bảo trì. Vui lòng quay lại sau.',
                timestamp: event.detail.timestamp || Date.now()
            });
            setIsVisible(true);
        };

        // Listen for maintenance mode events from api.js
        window.addEventListener('maintenance-mode', handleMaintenanceMode);

        return () => {
            window.removeEventListener('maintenance-mode', handleMaintenanceMode);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleRetry = () => {
        setIsVisible(false);
        window.location.reload();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-100 rounded-full p-3">
                        <Wrench className="w-12 h-12 text-yellow-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Hệ thống đang bảo trì
                </h2>

                {/* Message */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                {maintenanceInfo.message}
                            </p>
                            <p className="text-xs text-yellow-600 mt-2">
                                Thời gian: {new Date(maintenanceInfo.timestamp).toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6">
                    Chúng tôi đang thực hiện bảo trì hệ thống để cải thiện trải nghiệm của bạn.
                    Vui lòng quay lại sau ít phút.
                </p>

                {/* Actions */}
                <div className="flex space-x-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleRetry}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceModal;
