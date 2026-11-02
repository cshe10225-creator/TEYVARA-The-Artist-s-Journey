import React, { useState } from 'react';
import { ArrowLeft, Printer, Award, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { PlayerProfile, Character } from '../types/game';
import { soundService } from '../services/soundService';

interface CertificateModalProps {
  profile: PlayerProfile;
  activeCharacter: Character;
  onBack: () => void;
  onUpdateProfileName: (newName: string, newSchool: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  profile,
  activeCharacter,
  onBack,
  onUpdateProfileName,
}) => {
  const [studentName, setStudentName] = useState(profile.name || 'Pengembara Cilik');
  const [schoolName, setSchoolName] = useState(profile.schoolName || 'SK Teyvara Indah');
  const [isEditing, setIsEditing] = useState(false);

  const handlePrint = () => {
    soundService.playButtonClick();
    window.print();
  };

  const handleSaveName = () => {
    soundService.playButtonClick();
    setIsEditing(false);
    onUpdateProfileName(studentName, schoolName);
  };

  const todayDate = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 animate-fade-in min-h-[calc(100vh-56px)] flex flex-col justify-between">
      {/* Header Controls (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20 mb-6 print:hidden">
        <div>
          <button
            onClick={() => {
              soundService.playButtonClick();
              onBack();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Peta</span>
          </button>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Sijil Digital Pengembara Seni</span>
            <Award className="w-5 h-5 text-amber-400" />
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            {isEditing ? 'Tutup Pilihan Nama' : 'Ubah Nama / Sekolah'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-md shadow-amber-400/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Optional Name Editor Toolbar (Hidden when printing) */}
      {isEditing && (
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl mb-6 flex flex-col sm:flex-row items-center gap-3 print:hidden">
          <div className="flex-1 w-full">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nama Murid:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nama Sekolah:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            onClick={handleSaveName}
            className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-300"
          >
            Simpan Nama
          </button>
        </div>
      )}

      {/* The Printable Certificate Parchment */}
      <div
        id="certificate-print-area"
        className="relative bg-gradient-to-b from-amber-50 via-amber-100/90 to-amber-50 text-slate-900 rounded-3xl p-8 md:p-12 border-8 border-amber-600 shadow-2xl overflow-hidden my-auto max-w-4xl mx-auto"
      >
        {/* Ornate Gold Border Inner Inset */}
        <div className="absolute inset-3 border-2 border-amber-500/60 rounded-2xl pointer-events-none" />
        <div className="absolute inset-5 border border-amber-400/40 rounded-xl pointer-events-none" />

        {/* Corner Ornaments */}
        <div className="absolute top-6 left-6 text-amber-700/60 font-cinzel text-xl">✦</div>
        <div className="absolute top-6 right-6 text-amber-700/60 font-cinzel text-xl">✦</div>
        <div className="absolute bottom-6 left-6 text-amber-700/60 font-cinzel text-xl">✦</div>
        <div className="absolute bottom-6 right-6 text-amber-700/60 font-cinzel text-xl">✦</div>

        {/* Certificate Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-amber-800 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2">
            <span>KEMENTERIAN PENDIDIKAN MALAYSIA · PSV TAHUN 3</span>
          </div>

          <h1 className="font-cinzel text-3xl md:text-5xl font-black text-amber-950 tracking-wider mb-2">
            SIJIL PENGEMBARA SENI TEYVARA
          </h1>

          <div className="h-0.5 w-48 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto my-3" />

          <p className="text-xs md:text-sm text-amber-900 font-medium italic mb-6">
            Dengan ini diperakui bahawa murid yang berani dan berbakat ini:
          </p>

          {/* Student Name */}
          <div className="text-2xl md:text-4xl font-black text-slate-950 uppercase tracking-wide border-b-2 border-amber-800/40 pb-2 max-w-xl mx-auto my-3">
            {studentName}
          </div>

          <p className="text-xs md:text-sm text-amber-900 font-semibold mb-6">
            dari <span className="font-bold text-slate-950">{schoolName}</span>
          </p>

          {/* Achievement Description */}
          <p className="max-w-2xl mx-auto text-xs md:text-sm text-slate-800 leading-relaxed font-serif mb-8">
            Telah berjaya menyempurnakan kesemua lima misi pembelajaran Pendidikan Seni Visual (Bidang Lukisan)
            KSSR Tahun 3, menguasai pengenalan media kering, variasi jenis garisan, langkah lakaran berperingkat,
            kemahiran pemerhatian objek alam, dan menyatukan semula <strong>Kristal Inspirasi Alam Teyvara</strong>.
          </p>

          {/* 5 Earned Badges Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-2xl mx-auto mb-8">
            {[
              { name: 'Pakar Alat Seni', sub: 'Media Kering' },
              { name: 'Sahabat Garisan', sub: 'Variasi Garisan' },
              { name: 'Pengembara Kreatif', sub: 'Proses Lakaran' },
              { name: 'Pelukis Teyvara', sub: 'Pemerhatian' },
              { name: 'Legenda Diraja', sub: 'Penyatuan Kristal' },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="bg-amber-200/60 border border-amber-600/30 rounded-xl p-2 text-center"
              >
                <Award className="w-5 h-5 text-amber-800 mx-auto mb-0.5" />
                <div className="text-[10px] font-bold text-amber-950 leading-tight">{badge.name}</div>
                <div className="text-[9px] text-amber-800/80">{badge.sub}</div>
              </div>
            ))}
          </div>

          {/* Signatures and Date */}
          <div className="flex items-end justify-between pt-6 border-t border-amber-700/30 max-w-2xl mx-auto text-left">
            <div>
              <div className="text-[11px] text-amber-900 font-medium">Tarikh Penganugerahan:</div>
              <div className="text-xs font-bold text-slate-950">{todayDate}</div>
            </div>

            {/* Stamp seal */}
            <div className="w-16 h-16 rounded-full border-2 border-amber-700 bg-amber-200/50 flex flex-col items-center justify-center text-center p-1 text-amber-900 rotate-[-8deg] shadow-sm">
              <span className="text-[8px] font-black uppercase">TEYVARA</span>
              <Award className="w-4 h-4 text-amber-800" />
              <span className="text-[7px] font-bold">LULUS PSV</span>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-950 italic">Mentor Mira & Guru PSV</div>
              <div className="text-[10px] text-amber-900">Akademi Seni Lukisan Teyvara</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-slate-400 pt-4 print:hidden">
        Sijil ini boleh dicetak terus atau disimpan sebagai dokumen PDF untuk simpanan portfolio murid.
      </div>
    </div>
  );
};
