import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, StopCircle } from 'lucide-react';

export default function ScannerComponent({ onScanSuccess, onScanError }) {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount — use the ref, not the state
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current.stop().catch(() => {}).then(() => {
          try { scannerRef.current.clear(); } catch(e) {}
        });
        isScanningRef.current = false;
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      setErrorMsg('');
      // If a previous instance exists, clean it up first
      if (scannerRef.current && isScanningRef.current) {
        try { await scannerRef.current.stop(); } catch(e) {}
        try { scannerRef.current.clear(); } catch(e) {}
        isScanningRef.current = false;
      }

      const html5QrCode = new Html5Qrcode("qr-reader-custom");
      scannerRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
           if(onScanSuccess) onScanSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
           // This fires on every frame that doesn't decode — ignore it
        }
      );
      isScanningRef.current = true;
      setIsScanning(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not start camera. Please ensure camera permissions are granted in your browser settings.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
        try { scannerRef.current.clear(); } catch(e) {}
        isScanningRef.current = false;
        setIsScanning(false);
      } catch (err) {
        console.error(err);
        // Force state reset even if stop fails
        isScanningRef.current = false;
        setIsScanning(false);
      }
    } else {
      // Scanner isn't running, just reset state
      isScanningRef.current = false;
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200">
      <div className="relative">
        <div id="qr-reader-custom" className="w-full bg-slate-100 rounded-lg overflow-hidden min-h-[250px]"></div>
        {!isScanning && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100/80 rounded-lg z-10 pointer-events-none">
             <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p className="font-semibold">Camera is off</p>
           </div>
        )}
      </div>
      
      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">
          {errorMsg}
        </div>
      )}
      
      <div className="mt-4 flex gap-3 justify-center">
        {!isScanning ? (
          <button onClick={startScanner} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
            <Camera className="w-5 h-5" /> Start Camera
          </button>
        ) : (
          <button onClick={stopScanner} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
            <StopCircle className="w-5 h-5" /> Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}
