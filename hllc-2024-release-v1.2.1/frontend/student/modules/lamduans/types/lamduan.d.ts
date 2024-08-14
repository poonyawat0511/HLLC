interface Lamduan {
  id: string
  user: string
  text: string
  lamduanImage: string | File | null;
}

interface LamduanSetting {
  isLoaded: boolean
  dateTimes: {
    open?: Date | null
    close?: Date | null
  }
  youtube:  string
  tutorial: string
}

interface LamduanActivities {
  id: string;
  name: {
    th: string;
    en: string;
  };
  shortName: {
    th: string;
    en: string;
  };
  code: string;
  type: number;
  description: {
    th: string;
    en: string;
  };
  shortDesc: {
    th: string;
    en: string;
  };
  banner: string;
  icon: string;
  open: boolean;
  progress: boolean;
  show: boolean;
  item: {
    name: {
      th: string;
      en: string;
    };
    description: {
      th: string;
      en: string;
    };
    images: {
      hidden: string;
      activated: string;
    };
    id: string;
  };
  location: {
    th: string;
    en: string;
  };
  dateTime: {
    start: string | null;
    end: string | null;
  };
  status: {
    step: number;
    message: string;
  };
}
