import axiosInstance from '@/api/axiosConfig'

const currentWeather = async (location) => {
    const response = await axiosInstance.get(`weather/current/`, {
        params: { location }
    });
    return response.data;
}

const weatherDashboard = async () => {
    const response = await axiosInstance.get('weather/dashboard/');
    return response.data;
}  

const forecastWeather = async (location, days) => {
    const response = await axiosInstance.get(`weather/forecast/`, {
        params: { location, days }
    });
    return response.data;
}

export default {
    currentWeather,
    forecastWeather,
    weatherDashboard
}