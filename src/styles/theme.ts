import { ThemeConfig } from 'antd/es/config-provider/context';

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#4E9BFF',
    colorBgBase: '#121212',
    colorTextBase: '#E0E0E0',
    borderRadius: 8,
  },
  components: {
    Layout: {
      bodyBg: '#1a1d21',
    },
    Card: {
      colorBgContainer: '#242830',
      colorBorderSecondary: '#242830',
    },
    Drawer: {
      colorBgElevated: '#242830',
      colorText: '#ffffff',
    },
    Button: {
      colorBgContainer: '#242830',
      colorText: '#ffffff',
    },
    Input: {
      colorBgContainer: '#242830',
      colorBorder: '#363c48',
      colorText: '#ffffff',
    },
    Select: {
      colorBgContainer: '#242830',
      colorBorder: '#363c48',
      colorText: '#ffffff',
      controlItemBgActive: '#363c48',
      colorBgElevated: '#242830',
    },
  },
};
