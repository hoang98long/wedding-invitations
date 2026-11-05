// All dates include the Vietnam UTC+7 offset, independently of server timezone.
export const wedding = {
  groom: "Hoàng Long",
  bride: "Hà Thanh",
  dates: "28, 29-11-2026",
  countdownTo: "2026-11-28T16:00:00+07:00"
};

export const ceremonies = [
  {
    side: "Chú rể",
    name: "Hoàng Long",
    events: [
      {
        title: "Bữa cơm thân mật",
        date: "28/11/2026",
        weekday: "Thứ Bảy",
        time: "16h00",
        dateTime: "2026-11-28T16:00:00+07:00"
      },
      {
        title: "Lễ Thành hôn",
        date: "29/11/2026",
        weekday: "Chủ Nhật",
        time: "11h00",
        dateTime: "2026-11-29T11:00:00+07:00"
      }
    ],
    area: "Tân Kỳ, Hải Phòng",
    venue: "AN KIDS - Siêu thị Mẹ và Bé",
    // !3d / !4d from the supplied place URL, rather than the map viewport center.
    coordinates: "20.8152004,106.3205681",
    placeUrl: "https://www.google.com/maps/place/AN+KIDS+-+Si%C3%AAu+th%E1%BB%8B+M%E1%BA%B9+v%C3%A0+B%C3%A9/@20.8152004,106.3180468,17z/data=!4m6!3m5!1s0x3135910064b223c3:0x478a31ca9928ef7e!8m2!3d20.8152004!4d106.3205681!16s%2Fg%2F11w39_h4kl"
  },
  {
    side: "Cô dâu",
    name: "Hà Thanh",
    events: [
      {
        title: "Bữa cơm thân mật",
        date: "28/11/2026",
        weekday: "Thứ Bảy",
        time: "16h00",
        dateTime: "2026-11-28T16:00:00+07:00"
      },
      {
        title: "Lễ Đón dâu",
        date: "29/11/2026",
        weekday: "Chủ Nhật",
        time: "09h00",
        dateTime: "2026-11-29T09:00:00+07:00"
      }
    ],
    area: "Chí Minh, Hải Phòng",
    venue: "Nhà văn hóa thôn Gia Lộc",
    coordinates: "20.8066873,106.4282514",
    placeUrl: "https://www.google.com/maps/place/Nh%C3%A0+V%C4%83n+H%C3%B3a+Th%C3%B4n+Gia+L%E1%BB%99c/@20.8066873,106.4256765,17z/data=!3m1!4b1!4m6!3m5!1s0x31358eda0309f4c1:0x921cb8f76b5ac35f!8m2!3d20.8066873!4d106.4282514!16s%2Fg%2F11g_xz6hm"
  }
] as const;

export const weddingPhotos = [
  { file: "LMC_0464", alt: "Hoàng Long và Hà Thanh bên những đóa hoa trong bộ ảnh cưới" },
  { file: "LMC_0129", alt: "Nụ cười hạnh phúc của Hoàng Long và Hà Thanh" },
  { file: "LMC_6558", alt: "Cô dâu và chú rể trao nhau ánh nhìn bên khung cửa" },
  { file: "LMC_8835", alt: "Hoàng Long và Hà Thanh trong tà áo dài và quân phục" },
  { file: "LMC_0588", alt: "Khoảnh khắc dịu dàng bên nhau của cô dâu và chú rể" },
  { file: "LMC_9845", alt: "Cô dâu nâng bó hoa bên chú rể trong ngày chụp ảnh cưới" }
] as const;

export function directionsUrl(coordinates: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinates)}&travelmode=driving`;
}

export function mapEmbedUrl(coordinates: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(coordinates)}&z=16&hl=vi&output=embed`;
}
