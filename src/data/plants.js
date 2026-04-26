export const plantTemplates = [
  {
    id: 'dua_leo',
    name: 'Dưa leo',
    duration: 45,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 5 },
      { name: 'Sinh trưởng', dayStart: 6, dayEnd: 25 },
      { name: 'Ra hoa', dayStart: 26, dayEnd: 35 },
      { name: 'Thu hoạch', dayStart: 36, dayEnd: 45 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 3, title: 'Tưới nhẹ' },
      { day: 10, title: 'Bón phân' },
      { day: 20, title: 'Làm giàn' },
      { day: 30, title: 'Theo dõi hoa' },
      { day: 40, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'muop',
    name: 'Mướp',
    duration: 60,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 5 },
      { name: 'Leo giàn', dayStart: 6, dayEnd: 30 },
      { name: 'Ra hoa', dayStart: 31, dayEnd: 45 },
      { name: 'Ra trái', dayStart: 46, dayEnd: 60 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 7, title: 'Bón phân' },
      { day: 15, title: 'Làm giàn' },
      { day: 35, title: 'Thụ phấn' },
      { day: 50, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'kho_qua',
    name: 'Khổ qua',
    duration: 55,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 5 },
      { name: 'Sinh trưởng', dayStart: 6, dayEnd: 25 },
      { name: 'Ra hoa', dayStart: 26, dayEnd: 40 },
      { name: 'Ra trái', dayStart: 41, dayEnd: 55 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 5, title: 'Tưới nước' },
      { day: 12, title: 'Bón phân' },
      { day: 20, title: 'Làm giàn' },
      { day: 35, title: 'Thụ phấn' },
      { day: 50, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'rau_muong',
    name: 'Rau muống',
    duration: 25,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 3 },
      { name: 'Phát triển', dayStart: 4, dayEnd: 15 },
      { name: 'Thu hoạch', dayStart: 16, dayEnd: 25 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 2, title: 'Giữ ẩm' },
      { day: 7, title: 'Bón phân nhẹ' },
      { day: 15, title: 'Tỉa bớt' },
      { day: 20, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'cai_xanh',
    name: 'Cải xanh',
    duration: 30,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 3 },
      { name: 'Phát triển', dayStart: 4, dayEnd: 20 },
      { name: 'Thu hoạch', dayStart: 21, dayEnd: 30 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 3, title: 'Tưới nước' },
      { day: 10, title: 'Bón phân' },
      { day: 18, title: 'Tỉa cây' },
      { day: 25, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'cai_ngot',
    name: 'Cải ngọt',
    duration: 28,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 3 },
      { name: 'Phát triển', dayStart: 4, dayEnd: 18 },
      { name: 'Thu hoạch', dayStart: 19, dayEnd: 28 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 3, title: 'Tưới nước' },
      { day: 9, title: 'Bón phân' },
      { day: 15, title: 'Tỉa cây' },
      { day: 25, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'xa_lach',
    name: 'Xà lách',
    duration: 35,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 4 },
      { name: 'Phát triển', dayStart: 5, dayEnd: 25 },
      { name: 'Thu hoạch', dayStart: 26, dayEnd: 35 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 4, title: 'Giữ ẩm' },
      { day: 10, title: 'Bón phân' },
      { day: 20, title: 'Tỉa lá' },
      { day: 30, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'hanh_la',
    name: 'Hành lá',
    duration: 30,
    stages: [
      { name: 'Ra rễ', dayStart: 0, dayEnd: 5 },
      { name: 'Phát triển', dayStart: 6, dayEnd: 20 },
      { name: 'Thu hoạch', dayStart: 21, dayEnd: 30 },
    ],
    tasks: [
      { day: 0, title: 'Trồng củ' },
      { day: 3, title: 'Tưới nước' },
      { day: 10, title: 'Bón phân' },
      { day: 20, title: 'Tỉa lá' },
      { day: 25, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'ca_chua',
    name: 'Cà chua',
    duration: 75,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 5 },
      { name: 'Sinh trưởng', dayStart: 6, dayEnd: 35 },
      { name: 'Ra hoa', dayStart: 36, dayEnd: 55 },
      { name: 'Ra trái', dayStart: 56, dayEnd: 75 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 7, title: 'Cấy cây' },
      { day: 15, title: 'Bón phân' },
      { day: 25, title: 'Làm giàn' },
      { day: 45, title: 'Ra hoa' },
      { day: 65, title: 'Thu hoạch' },
    ],
  },

  {
    id: 'ot',
    name: 'Ớt',
    duration: 80,
    stages: [
      { name: 'Nảy mầm', dayStart: 0, dayEnd: 7 },
      { name: 'Sinh trưởng', dayStart: 8, dayEnd: 40 },
      { name: 'Ra hoa', dayStart: 41, dayEnd: 60 },
      { name: 'Ra trái', dayStart: 61, dayEnd: 80 },
    ],
    tasks: [
      { day: 0, title: 'Gieo hạt' },
      { day: 10, title: 'Cấy cây' },
      { day: 20, title: 'Bón phân' },
      { day: 35, title: 'Tỉa cành' },
      { day: 55, title: 'Ra hoa' },
      { day: 70, title: 'Thu hoạch' },
    ],
  },
 
]
