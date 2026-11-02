import { Character } from '../types/game';

export const CHARACTERS: Character[] = [
  {
    id: 'aira',
    name: 'Aira',
    title: 'Pengembara Garisan & Kristal Langit',
    bio: 'Aira merupakan penjelajah muda yang peka dengan kecantikan alam sekitar Teyvara. Dia menggunakan stilus kristal untuk mengesan aliran garisan tersembunyi pada pokok, awan, dan pergunungan.',
    specialty: 'Ketepatan Garisan & Rupa Geometri',
    tool: 'Stilus Kristal Angkasa & Beg Lakaran',
    quote: '"Setiap lukisan yang hebat bermula dengan satu garisan yang berani!"',
    imagePath: '/src/assets/images/character_aira_1793628366497.jpg',
    colorScheme: {
      primary: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/40',
      border: 'border-cyan-400',
    },
  },
  {
    id: 'kael',
    name: 'Kael',
    title: 'Cendekiawan Lakaran & Bayangan',
    bio: 'Kael mengkaji teknik lukisan kuno Teyvara. Dengan buku lakaran ajaibnya, dia mahir membina struktur lukisan berperingkat daripada lakaran asas hingga ke lorekan ton gelap.',
    specialty: 'Lakaran Berperingkat & Lorekan Ton',
    tool: 'Buku Lakaran Purba & Pena Arkib',
    quote: '"Perhatikan cahaya dan bayang. Di situlah terletaknya rahsia bentuk objek!"',
    imagePath: '/src/assets/images/character_kael_1793628367255.jpg',
    colorScheme: {
      primary: 'from-indigo-600 to-amber-600',
      glow: 'shadow-indigo-500/40',
      border: 'border-amber-400',
    },
  },
  {
    id: 'mira',
    name: 'Mira',
    title: 'Mentor Akademi Seni Teyvara',
    bio: 'Guru seni yang ceria, penuh kasih sayang dan berpengetahuan luas tentang kurikulum Pendidikan Seni Visual Tahun 3. Membimbing murid menguasai alat, teknik dan keyakinan diri.',
    specialty: 'Media Kering & Apresiasi Seni',
    tool: 'Berus Ajaib Gergasi & Kitab Panduan Seni',
    quote: '"Jangan takut membuat kesilapan. Setiap kesilapan mengajar kita menghasilkan karya yang lebih indah!"',
    imagePath: '/src/assets/images/character_mira_1793628368249.jpg',
    colorScheme: {
      primary: 'from-emerald-500 to-teal-700',
      glow: 'shadow-emerald-500/40',
      border: 'border-emerald-400',
    },
  },
];
