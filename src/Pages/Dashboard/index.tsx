import React, { useCallback, useEffect, useMemo, useState,  } from "react";
import DayPicker, { DayModifiers} from 'react-day-picker';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import { ptBR } from "date-fns/locale";
import 'react-day-picker/lib/style.css';


import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar,
NextAppointment, Section, Appointment } from "./styles";
import logoImg from '../../assets/logo.svg';
import { FiClock, FiPower } from "react-icons/fi";
import { useAuth } from "../../hooks/Auth";
import api from "../../services/apiClient";
import { Link } from "react-router-dom";


interface MonthAvaliabilityItem {
    day: number;
    avaliable: boolean;
}



interface Appointment2 {
    id: string;
    date: string;
    hourFormatted: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrenteMonth] = useState(new Date());
    const [monthAvaliability, setMonthAvaliability] = useState<MonthAvaliabilityItem[]>([]);
    const [appointments, setAppointments] = useState<Appointment2[]>([]);
     // possivel cagada//
    const token = localStorage.getItem('@GoBarber:token');

    console.log(token);

     // possivel cagada//

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => { 
        console.log('oi')
        if (modifiers.avaliable && !modifiers.disabled) {
            setSelectedDate(day);
        }   
    }, []);

    const handleMonthChange = useCallback ((month: Date) => {
        setCurrenteMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-avaliability`, {
            // possivel cagada//
            headers: {
                'Authorization': `Bearer ${token}`
            },
             // possivel cagada//
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,           
            },
        }).then(response => {
            setMonthAvaliability(response.data);
        });
    }, [currentMonth, user.id, token]);

    useEffect(() => {
        api.get<Appointment2[]>('/appointments/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(), 
            }
        }).then(response => {
            const appointmentsFormatted = response.data.map(appointment => {
                return {
                    ...appointment,
                    hourFormatted: format(parseISO(appointment.date), 'HH:mm')
                }
            });

            setAppointments(appointmentsFormatted);
        })
        
    }, [selectedDate, token])

    const disabledDays = useMemo(() => { 
        // eslint-disable-next-line eqeqeq
        const dates = monthAvaliability.filter(monthDay => monthDay.avaliable === false)
        .map(monthDay => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            return new Date(year, month, monthDay.day);


        });

        return dates;
    }, [currentMonth, monthAvaliability]);

    const selectedDayAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
            locale: ptBR,
        })
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, 'cccc', {locale: ptBR})
    }, [selectedDate]);

    const morningAppointments = useMemo(( ) => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12;
        })
    }, [appointments]);

    const afternoonAppointments = useMemo(( ) => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12;
        })
    }, [appointments]);

    const nextAppointment = useMemo(() => {
        return appointments.find(appointment =>
            isAfter (parseISO(appointment.date), new Date())   
        )
    }, [appointments])

    return (<Container>
    <Header>
        <HeaderContent>
            <img src={logoImg} alt="GoBarber" />

            <Profile>
                {/* <img src={user.avatar_url} alt={user.name} /> */}
                <img src={user.avatar_url} alt={user.name} />
                <div>
                    <span>Bem vindo</span>
                    <Link to={'/profile'}>
                        <strong>{user.name}</strong>
                    </Link>
                </div>
            </Profile>
            <button type="button" onClick={signOut}>
                <FiPower/>
            </button>
        </HeaderContent>
    </Header>

    <Content>
        <Schedule>
            <h1>Horários agendados</h1>
            <p>
                {isToday(selectedDate) && <span>Hoje</span>}
                <span>{selectedDayAsText}</span>
                <span>{selectedWeekDay}</span>
            </p>

            {isToday(selectedDate) && nextAppointment && (
                <NextAppointment>
                    <strong>Agendamento a Seguir</strong>
                    <div>
                        <img src={nextAppointment.user.avatar_url} alt={nextAppointment.user.name} />
                        
                        <strong>{nextAppointment.user.name}</strong>
                        <span>
                            <FiClock/>
                            {nextAppointment.hourFormatted}
                        </span>
                    </div>
                </NextAppointment>
            )}

            <Section>
                <strong>Manhã</strong>

                {morningAppointments.length === 0 && (
                    <p>Nenhum agendamento nesse período</p>
                )}

                {morningAppointments.map(appointment => (
                    <Appointment key={appointment.id}>
                        <span>
                            <FiClock/>
                            {appointment.hourFormatted}
                        </span>

                        <div>
                            <img src={appointment.user.avatar_url} alt="Vinicius Ferreira" />
                            <strong>{appointment.user.name}</strong>
                        </div>
                    </Appointment>
                ))}

                

            </Section>
            <Section>
                {afternoonAppointments.map(appointment => (
                        <Appointment key={appointment.id}>
                            <span>
                                <FiClock/>
                                {appointment.hourFormatted}
                            </span>

                            <div>
                                <img src={appointment.user.avatar_url} alt="Vinicius Ferreira" />
                                <strong>{appointment.user.name}</strong>
                            </div>
                        </Appointment>
                    ))}
            </Section>

        </Schedule>
        <Calendar>
            <DayPicker
                weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                fromMonth={new Date()}
                disabledDays={[
                    {daysOfWeek: [0, 6]}, ...disabledDays 
                ]}
                modifiers={{
                    available: { daysOfWeek: [1, 2, 3, 4, 5]},
                }}
                onMonthChange={handleMonthChange}
                selectedDays={selectedDate}
                onDayClick={handleDateChange}
                months= {[
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',

                ]}
            />
        </Calendar>
    </Content>

    </Container>)
}

export default Dashboard;